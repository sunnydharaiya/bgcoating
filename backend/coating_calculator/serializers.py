from rest_framework import serializers
from .models import CalculatorLog


class CalculatorLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = CalculatorLog
        fields = [
            'id', 'user', 'username', 'tool_id', 'tool_name', 'category',
            'project_name', 'client_name', 'inputs', 'results', 'notes',
            'ip_address', 'user_agent', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'ip_address', 'user_agent', 'created_at', 'updated_at']
