from django.contrib import admin
from .models import SpecificationRecord


@admin.register(SpecificationRecord)
class SpecificationRecordAdmin(admin.ModelAdmin):
    list_display = ('spec_id', 'proj_no', 'status', 'revision', 'user', 'is_active_draft', 'updated_at')
    list_filter = ('status', 'revision', 'is_active_draft', 'created_at')
    search_fields = ('spec_id', 'proj_no', 'proj_desc', 'cust_name', 'prepared_by')
    readonly_fields = ('created_at', 'updated_at', 'ip_address', 'user_agent')
