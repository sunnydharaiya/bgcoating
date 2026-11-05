from django.contrib import admin
from .models import InspectionRecord


@admin.register(InspectionRecord)
class InspectionRecordAdmin(admin.ModelAdmin):
    list_display = [
        'report_no',
        'project_name',
        'customer',
        'lead_inspector',
        'overall_compliance',
        'verdict',
        'status',
        'is_active_draft',
        'user',
        'created_at',
        'updated_at'
    ]
    list_filter = ['status', 'verdict', 'is_active_draft', 'created_at']
    search_fields = ['report_no', 'project_name', 'customer', 'lead_inspector', 'work_location']
    readonly_fields = ['created_at', 'updated_at', 'ip_address', 'user_agent']
