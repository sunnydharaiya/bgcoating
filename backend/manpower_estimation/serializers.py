from rest_framework import serializers
from .models import ManpowerRecord


class ManpowerRecordSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)
    updated_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)

    class Meta:
        model = ManpowerRecord
        fields = [
            'id', 'user', 'username', 'est_no', 'project_name', 'customer',
            'location', 'currency', 'total_area', 'tonnage', 'blasting_total',
            'painting_total', 'raw_material_total', 'grand_total', 'cost_per_m2',
            'status', 'revision', 'is_active_draft', 'data', 'notes',
            'ip_address', 'user_agent', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'ip_address', 'user_agent', 'created_at', 'updated_at']
