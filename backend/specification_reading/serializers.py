from rest_framework import serializers
from .models import SpecificationRecord


class SpecificationRecordSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)
    updated_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)

    class Meta:
        model = SpecificationRecord
        fields = [
            'id', 'user', 'username', 'spec_id', 'din_no', 'proj_no',
            'proj_desc', 'cust_name', 'prepared_by', 'status', 'revision',
            'is_active_draft', 'data', 'notes', 'ip_address', 'user_agent',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'ip_address', 'user_agent', 'created_at', 'updated_at']
