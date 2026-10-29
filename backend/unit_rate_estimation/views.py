from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
import datetime
import uuid
from .models import UnitRateRecord
from .serializers import UnitRateRecordSerializer


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')


class UnitRateRecordViewSet(viewsets.ModelViewSet):
    """Flexible REST API for saving, querying, and managing Unit-Rate Commercial records and drafts."""
    queryset = UnitRateRecord.objects.all()
    serializer_class = UnitRateRecordSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = UnitRateRecord.objects.all()
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

        est_status = self.request.query_params.get('status')
        if est_status:
            qs = qs.filter(status__iexact=est_status)

        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(
                Q(est_no__icontains=search) |
                Q(project_name__icontains=search) |
                Q(customer__icontains=search) |
                Q(location__icontains=search) |
                Q(estimator__icontains=search)
            )

        limit = self.request.query_params.get('limit')
        if limit and limit.isdigit():
            qs = qs[:int(limit)]

        return qs

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        ip = get_client_ip(self.request)
        ua = self.request.META.get('HTTP_USER_AGENT', '')
        est_no = serializer.validated_data.get('est_no')
        if not est_no:
            est_no = f"EST-{uuid.uuid4().hex[:8].upper()}"
        serializer.save(user=user, ip_address=ip, user_agent=ua, est_no=est_no)

    @action(detail=False, methods=['get', 'post', 'delete'], url_path='draft')
    def handle_draft(self, request):
        """Get, save, or clear the single active working draft for this user/session."""
        user = request.user if request.user.is_authenticated else None
        ip = get_client_ip(request)

        if request.method == 'GET':
            qs = UnitRateRecord.objects.filter(is_active_draft=True)
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
            est_no = request.data.get('est_no', '')
            project_name = request.data.get('project_name', '')
            customer = request.data.get('customer', '')
            currency = request.data.get('currency', 'INR')
            location = request.data.get('location', '')
            estimator = request.data.get('estimator', '')
            total_area = request.data.get('total_area', 0.0)
            grand_total = request.data.get('grand_total', 0.0)
            cost_per_m2 = request.data.get('cost_per_m2', 0.0)
            est_status = request.data.get('status', 'Draft')

            # Extract fields from nested data if top-level is omitted
            if isinstance(payload_data, dict):
                if not est_no: est_no = payload_data.get('estNo', '')
                if not project_name: project_name = payload_data.get('projectName', '')
                if not customer: customer = payload_data.get('customer', '')
                if not currency or currency == 'INR': currency = payload_data.get('currency', 'INR')
                if not location: location = payload_data.get('location', '')
                if not estimator: estimator = payload_data.get('estimator', '')
                if not total_area: total_area = payload_data.get('totalArea', 0.0)
                if not grand_total: grand_total = payload_data.get('grandTotal', 0.0)
                if not cost_per_m2: cost_per_m2 = payload_data.get('costPerM2', 0.0)
                if not est_status or est_status == 'Draft': est_status = payload_data.get('status', 'Draft')

            # Upsert active draft
            qs = UnitRateRecord.objects.filter(is_active_draft=True)
            if user:
                draft = qs.filter(user=user).first()
            else:
                draft = qs.filter(user__isnull=True, ip_address=ip).first()

            if not draft:
                draft = UnitRateRecord(
                    user=user,
                    ip_address=ip,
                    user_agent=request.META.get('HTTP_USER_AGENT', ''),
                    est_no=est_no or f"DRAFT-{uuid.uuid4().hex[:8].upper()}",
                    is_active_draft=True
                )

            if est_no: draft.est_no = est_no
            if project_name: draft.project_name = project_name
            if customer: draft.customer = customer
            if currency: draft.currency = currency
            if location: draft.location = location
            if estimator: draft.estimator = estimator
            try: draft.total_area = float(total_area)
            except (ValueError, TypeError): pass
            try: draft.grand_total = float(grand_total)
            except (ValueError, TypeError): pass
            try: draft.cost_per_m2 = float(cost_per_m2)
            except (ValueError, TypeError): pass
            if est_status: draft.status = est_status
            draft.data = payload_data
            draft.save()

            serializer = self.get_serializer(draft)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'DELETE':
            qs = UnitRateRecord.objects.filter(is_active_draft=True)
            if user:
                deleted_count, _ = qs.filter(user=user).delete()
            else:
                deleted_count, _ = qs.filter(user__isnull=True, ip_address=ip).delete()
            return Response({'status': 'draft_cleared', 'deleted_count': deleted_count}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='claim-guest-estimates', permission_classes=[permissions.IsAuthenticated])
    def claim_guest_estimates(self, request):
        """Attaches guest quotation records and working drafts to the newly authenticated user."""
        estimate_ids = request.data.get('estimate_ids', [])
        claimed_count = 0
        ip = get_client_ip(request)

        # 1. Claim by explicit database IDs if passed
        if estimate_ids and isinstance(estimate_ids, list):
            valid_ids = [i for i in estimate_ids if isinstance(i, int) or (isinstance(i, str) and str(i).isdigit())]
            if valid_ids:
                claimed_count += UnitRateRecord.objects.filter(id__in=valid_ids, user__isnull=True).update(user=request.user)

        # 2. Claim by IP address for recent guest estimates created in the last 24 hours
        recent_threshold = timezone.now() - datetime.timedelta(hours=24)
        if ip:
            ip_claimed = UnitRateRecord.objects.filter(
                ip_address=ip,
                user__isnull=True,
                created_at__gte=recent_threshold
            ).update(user=request.user)
            claimed_count += ip_claimed

        return Response({
            'status': 'success',
            'claimed_count': claimed_count
        }, status=status.HTTP_200_OK)
