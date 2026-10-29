from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
import datetime
import uuid
from .models import SpecificationRecord
from .serializers import SpecificationRecordSerializer


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')


class SpecificationRecordViewSet(viewsets.ModelViewSet):
    """Flexible REST API for saving, querying, and managing Specification Reading records and drafts."""
    queryset = SpecificationRecord.objects.all()
    serializer_class = SpecificationRecordSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = SpecificationRecord.objects.all()
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

        spec_status = self.request.query_params.get('status')
        if spec_status:
            qs = qs.filter(status__iexact=spec_status)

        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(
                Q(proj_no__icontains=search) |
                Q(proj_desc__icontains=search) |
                Q(cust_name__icontains=search) |
                Q(din_no__icontains=search) |
                Q(prepared_by__icontains=search) |
                Q(spec_id__icontains=search)
            )

        limit = self.request.query_params.get('limit')
        if limit and limit.isdigit():
            qs = qs[:int(limit)]

        return qs

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        ip = get_client_ip(self.request)
        ua = self.request.META.get('HTTP_USER_AGENT', '')
        spec_id = serializer.validated_data.get('spec_id')
        if not spec_id:
            spec_id = f"SPEC-{uuid.uuid4().hex[:8].upper()}"
        serializer.save(user=user, ip_address=ip, user_agent=ua, spec_id=spec_id)

    @action(detail=False, methods=['get', 'post', 'delete'], url_path='draft')
    def handle_draft(self, request):
        """Get, save, or clear the single active working draft for this user/session."""
        user = request.user if request.user.is_authenticated else None
        ip = get_client_ip(request)

        if request.method == 'GET':
            qs = SpecificationRecord.objects.filter(is_active_draft=True)
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
            proj_no = request.data.get('proj_no', '')
            proj_desc = request.data.get('proj_desc', '')
            cust_name = request.data.get('cust_name', '')
            din_no = request.data.get('din_no', '')
            prepared_by = request.data.get('prepared_by', '')

            # Extract fields from nested data if top-level is omitted
            if isinstance(payload_data, dict):
                p_data = payload_data.get('projectData', {})
                if not proj_no: proj_no = p_data.get('projNo', '')
                if not proj_desc: proj_desc = p_data.get('projDesc', '')
                if not cust_name: cust_name = p_data.get('custName', '')
                if not din_no: din_no = p_data.get('dinNo', '')
                if not prepared_by: prepared_by = p_data.get('preparedBy', '')

            # Upsert active draft
            qs = SpecificationRecord.objects.filter(is_active_draft=True)
            if user:
                draft = qs.filter(user=user).first()
            else:
                draft = qs.filter(user__isnull=True, ip_address=ip).first()

            if not draft:
                draft = SpecificationRecord(
                    user=user,
                    ip_address=ip,
                    user_agent=request.META.get('HTTP_USER_AGENT', ''),
                    spec_id=f"DRAFT-{uuid.uuid4().hex[:8].upper()}",
                    is_active_draft=True
                )

            draft.proj_no = proj_no
            draft.proj_desc = proj_desc
            draft.cust_name = cust_name
            draft.din_no = din_no
            draft.prepared_by = prepared_by
            draft.data = payload_data
            draft.save()

            serializer = self.get_serializer(draft)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'DELETE':
            qs = SpecificationRecord.objects.filter(is_active_draft=True)
            if user:
                deleted_count, _ = qs.filter(user=user).delete()
            else:
                deleted_count, _ = qs.filter(user__isnull=True, ip_address=ip).delete()
            return Response({'status': 'draft_cleared', 'deleted_count': deleted_count}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='claim-guest-specs', permission_classes=[permissions.IsAuthenticated])
    def claim_guest_specs(self, request):
        """Attaches guest specifications and working drafts to the newly authenticated user."""
        spec_ids = request.data.get('spec_ids', [])
        claimed_count = 0
        ip = get_client_ip(request)

        # 1. Claim by explicit database IDs if passed
        if spec_ids and isinstance(spec_ids, list):
            valid_ids = [i for i in spec_ids if isinstance(i, int) or (isinstance(i, str) and str(i).isdigit())]
            if valid_ids:
                claimed_count += SpecificationRecord.objects.filter(id__in=valid_ids, user__isnull=True).update(user=request.user)

        # 2. Claim by IP address for recent guest specs created in the last 24 hours
        recent_threshold = timezone.now() - datetime.timedelta(hours=24)
        if ip:
            ip_claimed = SpecificationRecord.objects.filter(
                ip_address=ip,
                user__isnull=True,
                created_at__gte=recent_threshold
            ).update(user=request.user)
            claimed_count += ip_claimed

        return Response({
            'status': 'success',
            'claimed_count': claimed_count
        }, status=status.HTTP_200_OK)
