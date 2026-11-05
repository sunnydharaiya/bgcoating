import uuid
import datetime
from django.utils import timezone
from django.db.models import Q
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import InspectionRecord
from .serializers import InspectionRecordSerializer


def get_client_ip(request):
    """Utility to retrieve client IP behind reverse proxy / Cloudflare."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


class InspectionRecordViewSet(viewsets.ModelViewSet):
    """REST API for saving, querying, and managing Coating Inspection Reports (CIR) and working drafts."""
    queryset = InspectionRecord.objects.all()
    serializer_class = InspectionRecordSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = InspectionRecord.objects.all()
        user = self.request.user if hasattr(self.request, 'user') and self.request.user and self.request.user.is_authenticated else None

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
                Q(report_no__icontains=search) |
                Q(project_name__icontains=search) |
                Q(project_no__icontains=search) |
                Q(customer__icontains=search) |
                Q(vendor__icontains=search) |
                Q(work_location__icontains=search) |
                Q(lead_inspector__icontains=search) |
                Q(tpi_inspector__icontains=search)
            )

        limit = self.request.query_params.get('limit')
        if limit and limit.isdigit():
            qs = qs[:int(limit)]

        return qs

    def perform_create(self, serializer):
        user = self.request.user if hasattr(self.request, 'user') and self.request.user and self.request.user.is_authenticated else None
        ip = get_client_ip(self.request)
        ua = self.request.META.get('HTTP_USER_AGENT', '')
        report_no = serializer.validated_data.get('report_no')
        if not report_no:
            report_no = f"CIR-BG-{uuid.uuid4().hex[:8].upper()}"
        serializer.save(user=user, ip_address=ip, user_agent=ua, report_no=report_no)

    @action(detail=False, methods=['get', 'post', 'delete'], url_path='draft')
    def handle_draft(self, request):
        """Get, save, or clear the single active working draft for this user/session."""
        user = request.user if hasattr(request, 'user') and request.user and request.user.is_authenticated else None
        ip = get_client_ip(request)

        if request.method == 'GET':
            qs = InspectionRecord.objects.filter(is_active_draft=True)
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
            metrics_data = request.data.get('metrics', {})

            report_no = (
                request.data.get('report_no') or
                payload_data.get('reportNo') or
                payload_data.get('stages', {}).get('s1', {}).get('reportNo') or
                'CIR-DRAFT'
            )
            project_name = (
                request.data.get('project_name') or
                payload_data.get('projectName') or
                payload_data.get('stages', {}).get('s1', {}).get('projectName') or
                ''
            )
            project_no = (
                request.data.get('project_no') or
                payload_data.get('projectNo') or
                payload_data.get('stages', {}).get('s1', {}).get('projectNo') or
                ''
            )
            customer = (
                request.data.get('customer') or
                payload_data.get('customer') or
                payload_data.get('stages', {}).get('s1', {}).get('customer') or
                ''
            )
            vendor = (
                request.data.get('vendor') or
                payload_data.get('vendor') or
                payload_data.get('stages', {}).get('s1', {}).get('vendor') or
                ''
            )
            work_location = (
                request.data.get('work_location') or
                payload_data.get('workLocation') or
                payload_data.get('stages', {}).get('s1', {}).get('workLocation') or
                ''
            )
            lead_inspector = (
                request.data.get('lead_inspector') or
                payload_data.get('leadInspector') or
                payload_data.get('stages', {}).get('s1', {}).get('signApplicator', {}).get('name') or
                ''
            )
            lead_cert = request.data.get('lead_cert') or payload_data.get('leadCert') or ''
            tpi_inspector = request.data.get('tpi_inspector') or payload_data.get('tpiInspector') or ''
            tpi_agency = request.data.get('tpi_agency') or payload_data.get('tpiAgency') or ''

            raw_date = request.data.get('inspection_date') or payload_data.get('date') or payload_data.get('stages', {}).get('s1', {}).get('date')
            inspection_date = None
            if raw_date:
                try:
                    inspection_date = datetime.date.fromisoformat(str(raw_date)[:10])
                except (ValueError, TypeError):
                    inspection_date = None

            overall_compliance = float(
                request.data.get('overall_compliance') or
                metrics_data.get('weatherCompliancePct') or
                metrics_data.get('compliancePct') or
                100.0
            )
            verdict = request.data.get('verdict') or payload_data.get('verdict') or 'PASS'
            rec_status = request.data.get('status') or 'Draft'

            qs = InspectionRecord.objects.filter(is_active_draft=True)
            if user:
                draft = qs.filter(user=user).first()
            else:
                draft = qs.filter(user__isnull=True, ip_address=ip).first()

            if draft:
                draft.report_no = report_no
                draft.project_name = project_name
                draft.project_no = project_no
                draft.customer = customer
                draft.vendor = vendor
                draft.work_location = work_location
                draft.lead_inspector = lead_inspector
                draft.lead_cert = lead_cert
                draft.tpi_inspector = tpi_inspector
                draft.tpi_agency = tpi_agency
                draft.inspection_date = inspection_date
                draft.overall_compliance = overall_compliance
                draft.verdict = verdict
                draft.status = rec_status
                draft.data = payload_data
                draft.metrics = metrics_data
                draft.ip_address = ip
                draft.user_agent = request.META.get('HTTP_USER_AGENT', '')
                draft.save()
            else:
                draft = InspectionRecord.objects.create(
                    user=user,
                    report_no=report_no,
                    project_name=project_name,
                    project_no=project_no,
                    customer=customer,
                    vendor=vendor,
                    work_location=work_location,
                    lead_inspector=lead_inspector,
                    lead_cert=lead_cert,
                    tpi_inspector=tpi_inspector,
                    tpi_agency=tpi_agency,
                    inspection_date=inspection_date,
                    overall_compliance=overall_compliance,
                    verdict=verdict,
                    status=rec_status,
                    is_active_draft=True,
                    data=payload_data,
                    metrics=metrics_data,
                    ip_address=ip,
                    user_agent=request.META.get('HTTP_USER_AGENT', '')
                )

            serializer = self.get_serializer(draft)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'DELETE':
            qs = InspectionRecord.objects.filter(is_active_draft=True)
            if user:
                deleted_count, _ = qs.filter(user=user).delete()
            else:
                deleted_count, _ = qs.filter(user__isnull=True, ip_address=ip).delete()

            return Response({'deleted': deleted_count}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='claim-guest')
    def claim_guest_records(self, request):
        """Claims any anonymous guest inspection records and active drafts for the currently authenticated user."""
        if not hasattr(request, 'user') or not request.user or not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        ip = get_client_ip(request)
        if not ip:
            return Response({'claimed': 0}, status=status.HTTP_200_OK)

        guest_records = InspectionRecord.objects.filter(user__isnull=True, ip_address=ip)
        updated_count = guest_records.update(user=request.user)

        # Ensure only 1 active draft per user exists
        user_drafts = InspectionRecord.objects.filter(user=request.user, is_active_draft=True).order_by('-updated_at')
        if user_drafts.count() > 1:
            draft_ids_to_drop = list(user_drafts.values_list('id', flat=True)[1:])
            InspectionRecord.objects.filter(id__in=draft_ids_to_drop).delete()

        return Response({'claimed': updated_count}, status=status.HTTP_200_OK)
