from rest_framework import serializers
from .models import InspectionRecord


class InspectionRecordSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)
    updated_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)

    class Meta:
        model = InspectionRecord
        fields = [
            'id',
            'user',
            'username',
            'report_no',
            'project_name',
            'project_no',
            'customer',
            'vendor',
            'work_location',
            'equipment',
            'lead_inspector',
            'lead_cert',
            'tpi_inspector',
            'tpi_agency',
            'inspection_date',
            'overall_compliance',
            'verdict',
            'status',
            'revision',
            'is_active_draft',
            'data',
            'metrics',
            'notes',
            'ip_address',
            'user_agent',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'user', 'username', 'ip_address', 'user_agent', 'created_at', 'updated_at']
