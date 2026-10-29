import uuid
import datetime
from django.utils import timezone
from django.db.models import Q
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import PainterRecord
from .serializers import PainterRecordSerializer


def get_client_ip(request):
    """Utility to retrieve client IP behind reverse proxy / Cloudflare."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


class PainterRecordViewSet(viewsets.ModelViewSet):
    """Flexible REST API for saving, querying, and managing Spray Painter Qualification records and working drafts."""
    queryset = PainterRecord.objects.all()
    serializer_class = PainterRecordSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = PainterRecord.objects.all()
        user = self.request.user if self.request.user.is_authenticated else None

        if user:
            qs = qs.filter(user=user)
        else:
            qs = qs.filter(user__isnull=True)

        is_draft = self.request.query_params.get('is_active_draft')
        if is_draft is not None:
            qs = qs.filter(is_active_draft=(is_draft.lower() in ['true', '1', 'yes']))
        else:
            # Default to excluding working drafts from public register list
            qs = qs.filter(is_active_draft=False)

        rec_status = self.request.query_params.get('status')
        if rec_status:
            qs = qs.filter(status__iexact=rec_status)

        rec_verdict = self.request.query_params.get('verdict')
        if rec_verdict:
            qs = qs.filter(verdict__iexact=rec_verdict)

        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(
                Q(rep_no__icontains=search) |
                Q(operator_name__icontains=search) |
                Q(civil_id__icontains=search) |
                Q(project_name__icontains=search) |
                Q(client__icontains=search) |
                Q(contractor__icontains=search) |
                Q(qualification_card_no__icontains=search)
            )

        limit = self.request.query_params.get('limit')
        if limit and limit.isdigit():
            qs = qs[:int(limit)]

        return qs

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        ip = get_client_ip(self.request)
        ua = self.request.META.get('HTTP_USER_AGENT', '')
        rep_no = serializer.validated_data.get('rep_no')
        if not rep_no:
            rep_no = f"SP-QR-{uuid.uuid4().hex[:8].upper()}"
        serializer.save(user=user, ip_address=ip, user_agent=ua, rep_no=rep_no)

    @action(detail=False, methods=['get', 'post', 'delete'], url_path='draft')
    def handle_draft(self, request):
        """Get, save, or clear the single active working draft for this user/session."""
        user = request.user if request.user.is_authenticated else None
        ip = get_client_ip(request)

        if request.method == 'GET':
            qs = PainterRecord.objects.filter(is_active_draft=True)
            if user:
                draft = qs.filter(user=user).first()
            else:
                draft = qs.filter(user__isnull=True, ip_address=ip).first()

            if not draft:
                return Response({'detail': 'No active draft found'}, status=status.HTTP_404_NOT_FOUND)

            serializer = self.get_serializer(draft)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'POST':
            payload_data = request.data.get('data', request.data)
            rep_no = request.data.get('rep_no', '')
            operator_name = request.data.get('operator_name', '')
            category = request.data.get('category', 'Spray Painter')
            civil_id = request.data.get('civil_id', '')
            project_name = request.data.get('project_name', '')
            client = request.data.get('client', '')
            contractor = request.data.get('contractor', '')
            location = request.data.get('location', '')
            qualification_card_no = request.data.get('qualification_card_no', '')
            qualification_date = request.data.get('qualification_date', None)
            next_assessment_date = request.data.get('next_assessment_date', None)
            overall_score = request.data.get('overall_score', 0.0)
            verdict = request.data.get('verdict', 'PENDING')
            rec_status = request.data.get('status', 'Draft')
            revision = request.data.get('revision', 'R0')

            # Extract fields from nested data if top-level is omitted
            if isinstance(payload_data, dict):
                if not rep_no: rep_no = payload_data.get('repNo') or payload_data.get('f-rep-no') or ''
                if not operator_name: operator_name = payload_data.get('operatorName') or payload_data.get('f-name') or ''
                if not category or category == 'Spray Painter': category = payload_data.get('category') or payload_data.get('f-category') or 'Spray Painter'
                if not civil_id: civil_id = payload_data.get('civilId') or payload_data.get('f-civil') or ''
                if not project_name: project_name = payload_data.get('projectName') or payload_data.get('f-proj') or ''
                if not client: client = payload_data.get('client') or payload_data.get('f-client') or ''
                if not contractor: contractor = payload_data.get('contractor') or payload_data.get('f-contractor') or ''
                if not location: location = payload_data.get('location') or payload_data.get('f-location') or ''
                if not qualification_card_no: qualification_card_no = payload_data.get('qualificationCardNo') or payload_data.get('f-qual-card') or ''
                if not qualification_date: qualification_date = payload_data.get('qualificationDate') or payload_data.get('f-qual-date') or None
                if not next_assessment_date: next_assessment_date = payload_data.get('nextAssessmentDate') or payload_data.get('f-next-date') or None
                if not overall_score: overall_score = payload_data.get('overallScore') or payload_data.get('overall') or 0.0
                if not verdict or verdict == 'PENDING': verdict = payload_data.get('verdict', 'PENDING')
                if not rec_status or rec_status == 'Draft': rec_status = payload_data.get('status', 'Draft')
                if not revision or revision == 'R0': revision = payload_data.get('repRev', 'R0')

            # Upsert active draft
            qs = PainterRecord.objects.filter(is_active_draft=True)
            if user:
                draft = qs.filter(user=user).first()
            else:
                draft = qs.filter(user__isnull=True, ip_address=ip).first()

            if not draft:
                draft = PainterRecord(
                    user=user,
                    ip_address=ip,
                    user_agent=request.META.get('HTTP_USER_AGENT', ''),
                    rep_no=rep_no or f"DRAFT-SP-{uuid.uuid4().hex[:8].upper()}",
                    is_active_draft=True
                )

            if rep_no: draft.rep_no = rep_no
            if operator_name: draft.operator_name = operator_name
            if category: draft.category = category
            if civil_id: draft.civil_id = civil_id
            if project_name: draft.project_name = project_name
            if client: draft.client = client
            if contractor: draft.contractor = contractor
            if location: draft.location = location
            if qualification_card_no: draft.qualification_card_no = qualification_card_no
            if qualification_date:
                try: draft.qualification_date = qualification_date
                except Exception: pass
            if next_assessment_date:
                try: draft.next_assessment_date = next_assessment_date
                except Exception: pass
            try: draft.overall_score = float(overall_score)
            except (ValueError, TypeError): pass
            if verdict: draft.verdict = verdict
            if rec_status: draft.status = rec_status
            if revision: draft.revision = revision
            draft.data = payload_data
            draft.save()

            serializer = self.get_serializer(draft)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'DELETE':
            qs = PainterRecord.objects.filter(is_active_draft=True)
            if user:
                deleted_count, _ = qs.filter(user=user).delete()
            else:
                deleted_count, _ = qs.filter(user__isnull=True, ip_address=ip).delete()
            return Response({'status': 'draft_cleared', 'deleted_count': deleted_count}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='claim-guest-reports', permission_classes=[permissions.IsAuthenticated])
    def claim_guest_reports(self, request):
        """Attaches guest qualification dossiers and working drafts to the newly authenticated user."""
        report_ids = request.data.get('report_ids', [])
        claimed_count = 0
        ip = get_client_ip(request)

        # 1. Claim by explicit database IDs if passed
        if report_ids and isinstance(report_ids, list):
            valid_ids = [i for i in report_ids if isinstance(i, int) or (isinstance(i, str) and str(i).isdigit())]
            if valid_ids:
                claimed_count += PainterRecord.objects.filter(id__in=valid_ids, user__isnull=True).update(user=request.user)

        # 2. Claim by IP address for recent guest dossiers created in the last 24 hours
        recent_threshold = timezone.now() - datetime.timedelta(hours=24)
        if ip:
            claimed_count += PainterRecord.objects.filter(
                user__isnull=True,
                ip_address=ip,
                created_at__gte=recent_threshold
            ).update(user=request.user)

        return Response({
            'status': 'success',
            'claimed_count': claimed_count
        }, status=status.HTTP_200_OK)
