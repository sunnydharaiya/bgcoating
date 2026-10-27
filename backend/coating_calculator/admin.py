from django.contrib import admin
from .models import CalculatorLog


@admin.register(CalculatorLog)
class CalculatorLogAdmin(admin.ModelAdmin):
    list_display = ('tool_name', 'tool_id', 'user', 'project_name', 'created_at', 'ip_address')
    list_filter = ('category', 'tool_id', 'created_at')
    search_fields = ('tool_name', 'tool_id', 'project_name', 'client_name', 'user__username', 'notes')
    readonly_fields = ('created_at', 'updated_at', 'ip_address', 'user_agent')
