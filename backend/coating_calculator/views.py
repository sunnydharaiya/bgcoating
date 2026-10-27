from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
import datetime
from .models import CalculatorLog
from .serializers import CalculatorLogSerializer


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')


class CalculatorLogViewSet(viewsets.ModelViewSet):
    """Flexible REST API for saving, querying, and managing calculator audit logs."""
    queryset = CalculatorLog.objects.all()
    serializer_class = CalculatorLogSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = CalculatorLog.objects.all()
        tool_id = self.request.query_params.get('tool_id')
        category = self.request.query_params.get('category')
        project = self.request.query_params.get('project')
        limit = self.request.query_params.get('limit')

        if tool_id:
            qs = qs.filter(tool_id=tool_id)
        if category:
            qs = qs.filter(category=category)
        if project:
            qs = qs.filter(project_name__icontains=project)

        if self.request.user.is_authenticated:
            # Show logs created by this user
            qs = qs.filter(user=self.request.user)
        else:
            # For guests, return guest logs
            qs = qs.filter(user__isnull=True)

        if limit and limit.isdigit():
            qs = qs[:int(limit)]

        return qs

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        ip = get_client_ip(self.request)
        ua = self.request.META.get('HTTP_USER_AGENT', '')
        serializer.save(user=user, ip_address=ip, user_agent=ua)

    @action(detail=False, methods=['post'], url_path='claim-guest-logs', permission_classes=[permissions.IsAuthenticated])
    def claim_guest_logs(self, request):
        """Attaches guest calculation logs to the newly authenticated user."""
        log_ids = request.data.get('log_ids', [])
        claimed_count = 0
        ip = get_client_ip(request)

        # 1. Claim by explicit IDs if passed
        if log_ids and isinstance(log_ids, list):
            valid_ids = [i for i in log_ids if isinstance(i, int) or (isinstance(i, str) and str(i).isdigit())]
            if valid_ids:
                claimed_count += CalculatorLog.objects.filter(id__in=valid_ids, user__isnull=True).update(user=request.user)

        # 2. Claim by IP address for recent guest logs created in the last 4 hours
        recent_threshold = timezone.now() - datetime.timedelta(hours=4)
        if ip:
            ip_claimed = CalculatorLog.objects.filter(
                ip_address=ip,
                user__isnull=True,
                created_at__gte=recent_threshold
            ).update(user=request.user)
            claimed_count += ip_claimed

        return Response({
            'status': 'success',
            'claimed_count': claimed_count
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['delete'], url_path='clear-history')
    def clear_history(self, request):
        """Clears all calculation logs for the current user/session."""
        qs = self.get_queryset()
        count = qs.count()
        qs.delete()
        return Response({'status': 'cleared', 'deleted_count': count}, status=status.HTTP_200_OK)
