from django.contrib import admin
from .models import PainterRecord


@admin.register(PainterRecord)
class PainterRecordAdmin(admin.ModelAdmin):
    list_display = ('rep_no', 'operator_name', 'category', 'project_name', 'overall_score', 'verdict', 'status', 'is_active_draft', 'updated_at')
    list_filter = ('verdict', 'status', 'is_active_draft', 'category', 'updated_at')
    search_fields = ('rep_no', 'operator_name', 'civil_id', 'project_name', 'client', 'contractor')
    readonly_fields = ('created_at', 'updated_at', 'ip_address', 'user_agent')
