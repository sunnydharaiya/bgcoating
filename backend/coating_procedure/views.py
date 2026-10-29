from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
import datetime
import uuid
from .models import ProcedureRecord
from .serializers import ProcedureRecordSerializer


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')


class ProcedureRecordViewSet(viewsets.ModelViewSet):
    """Flexible REST API for saving, querying, and managing Coating Procedure records and active working drafts."""
    queryset = ProcedureRecord.objects.all()
    serializer_class = ProcedureRecordSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = ProcedureRecord.objects.all()
        user = self.request.user if self.request.user.is_authenticated else None

        if user:
            qs = qs.filter(user=user)
        else:
            qs = qs.filter(user__isnull=True)

        is_draft = self.request.query_params.get('is_active_draft')
        if is_draft is not None:
            qs = qs.filter(is_active_draft=(is_draft.lower() in ['true', '1', 'yes']))
        else:
            qs = qs.filter(is_active_draft=False)

        proc_status = self.request.query_params.get('status')
        if proc_status:
            qs = qs.filter(status__iexact=proc_status)

        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(
                Q(doc_no__icontains=search) |
                Q(project_name__icontains=search) |
                Q(client_name__icontains=search) |
                Q(contractor_name__icontains=search) |
                Q(facility_location__icontains=search) |
                Q(equipment_tag__icontains=search) |
                Q(project_number__icontains=search)
            )

        limit = self.request.query_params.get('limit')
        if limit and limit.isdigit():
            qs = qs[:int(limit)]

        return qs

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        ip = get_client_ip(self.request)
        ua = self.request.META.get('HTTP_USER_AGENT', '')
        doc_no = serializer.validated_data.get('doc_no')
        if not doc_no:
            doc_no = f"PROC-{uuid.uuid4().hex[:8].upper()}"
        serializer.save(user=user, ip_address=ip, user_agent=ua, doc_no=doc_no)

    @action(detail=False, methods=['get', 'post', 'delete'], url_path='draft')
    def handle_draft(self, request):
        """Get, save, or clear the single active working draft for this user/session."""
        user = request.user if request.user.is_authenticated else None
        ip = get_client_ip(request)

        if request.method == 'GET':
            qs = ProcedureRecord.objects.filter(is_active_draft=True)
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
            doc_no = request.data.get('doc_no', '')
            rev_no = request.data.get('rev_no', '')
            doc_title = request.data.get('doc_title', '')
            project_name = request.data.get('project_name', '')
            client_name = request.data.get('client_name', '')
            contractor_name = request.data.get('contractor_name', '')
            facility_location = request.data.get('facility_location', '')
            equipment_tag = request.data.get('equipment_tag', '')
            project_number = request.data.get('project_number', '')
            site_location = request.data.get('site_location', '')
            prepared_by = request.data.get('prepared_by', '')
            proc_status = request.data.get('status', '')

            # Extract fields from nested data if top-level is omitted
            if isinstance(payload_data, dict):
                if not doc_no: doc_no = payload_data.get('docNo', '')
                if not rev_no: rev_no = payload_data.get('revNo', '')
                if not doc_title: doc_title = payload_data.get('docTitle', '')
                if not project_name: project_name = payload_data.get('projectName', '')
                if not client_name: client_name = payload_data.get('clientName', '')
                if not contractor_name: contractor_name = payload_data.get('contractorName', '')
                if not facility_location: facility_location = payload_data.get('facilityLocation', '')
                if not equipment_tag: equipment_tag = payload_data.get('equipmentTag', '')
                if not project_number: project_number = payload_data.get('projectNumber', '')
                if not site_location: site_location = payload_data.get('siteLocation', '')
                if not prepared_by: prepared_by = payload_data.get('preparedBy', '')
                if not proc_status: proc_status = payload_data.get('status', 'Draft')

            # Upsert active draft
            qs = ProcedureRecord.objects.filter(is_active_draft=True)
            if user:
                draft = qs.filter(user=user).first()
            else:
                draft = qs.filter(user__isnull=True, ip_address=ip).first()

            if not draft:
                draft = ProcedureRecord(
                    user=user,
                    ip_address=ip,
                    user_agent=request.META.get('HTTP_USER_AGENT', ''),
                    doc_no=doc_no or f"DRAFT-{uuid.uuid4().hex[:8].upper()}",
                    is_active_draft=True
                )

            if doc_no: draft.doc_no = doc_no
            if rev_no: draft.rev_no = rev_no
            if doc_title: draft.doc_title = doc_title
            if project_name: draft.project_name = project_name
            if client_name: draft.client_name = client_name
            if contractor_name: draft.contractor_name = contractor_name
            if facility_location: draft.facility_location = facility_location
            if equipment_tag: draft.equipment_tag = equipment_tag
            if project_number: draft.project_number = project_number
            if site_location: draft.site_location = site_location
            if prepared_by: draft.prepared_by = prepared_by
            if proc_status: draft.status = proc_status
            draft.data = payload_data
            draft.save()

            serializer = self.get_serializer(draft)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'DELETE':
            qs = ProcedureRecord.objects.filter(is_active_draft=True)
            if user:
                deleted_count, _ = qs.filter(user=user).delete()
            else:
                deleted_count, _ = qs.filter(user__isnull=True, ip_address=ip).delete()
            return Response({'status': 'draft_cleared', 'deleted_count': deleted_count}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='claim-guest-procedures', permission_classes=[permissions.IsAuthenticated])
    def claim_guest_procedures(self, request):
        """Attaches guest procedure records and working drafts to the newly authenticated user."""
        proc_ids = request.data.get('proc_ids', [])
        claimed_count = 0
        ip = get_client_ip(request)

        # 1. Claim by explicit database IDs if passed
        if proc_ids and isinstance(proc_ids, list):
            valid_ids = [i for i in proc_ids if isinstance(i, int) or (isinstance(i, str) and str(i).isdigit())]
            if valid_ids:
                claimed_count += ProcedureRecord.objects.filter(id__in=valid_ids, user__isnull=True).update(user=request.user)

        # 2. Claim by IP address for recent guest procedures created in the last 24 hours
        recent_threshold = timezone.now() - datetime.timedelta(hours=24)
        if ip:
            ip_claimed = ProcedureRecord.objects.filter(
                ip_address=ip,
                user__isnull=True,
                created_at__gte=recent_threshold
            ).update(user=request.user)
            claimed_count += ip_claimed

        return Response({
            'status': 'success',
            'claimed_count': claimed_count
        }, status=status.HTTP_200_OK)
