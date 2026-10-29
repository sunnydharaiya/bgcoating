from django.contrib import admin
from .models import BlasterRecord


@admin.register(BlasterRecord)
class BlasterRecordAdmin(admin.ModelAdmin):
    list_display = ('rep_no', 'operator_name', 'category', 'project_name', 'client', 'verdict', 'status', 'overall_score', 'is_active_draft', 'user', 'updated_at')
    list_filter = ('status', 'verdict', 'is_active_draft', 'category', 'created_at')
    search_fields = ('rep_no', 'operator_name', 'civil_id', 'project_name', 'client', 'contractor', 'user__username')
    readonly_fields = ('created_at', 'updated_at', 'ip_address', 'user_agent')
