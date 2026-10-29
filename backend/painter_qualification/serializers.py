from rest_framework import serializers
from .models import PainterRecord


class PainterRecordSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)
    updated_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)

    class Meta:
        model = PainterRecord
        fields = [
            'id',
            'user',
            'username',
            'rep_no',
            'operator_name',
            'category',
            'civil_id',
            'project_name',
            'client',
            'contractor',
            'location',
            'qualification_card_no',
            'qualification_date',
            'next_assessment_date',
            'overall_score',
            'verdict',
            'status',
            'revision',
            'is_active_draft',
            'data',
            'notes',
            'ip_address',
            'user_agent',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'user', 'username', 'ip_address', 'user_agent', 'created_at', 'updated_at']
