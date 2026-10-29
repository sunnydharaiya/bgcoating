from rest_framework import serializers
from .models import ProcedureRecord


class ProcedureRecordSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)
    updated_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)

    class Meta:
        model = ProcedureRecord
        fields = [
            'id', 'user', 'username', 'doc_no', 'rev_no', 'doc_title',
            'project_name', 'client_name', 'contractor_name', 'facility_location',
            'equipment_tag', 'project_number', 'site_location', 'prepared_by',
            'status', 'revision', 'is_active_draft', 'data', 'notes',
            'ip_address', 'user_agent', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'ip_address', 'user_agent', 'created_at', 'updated_at']
