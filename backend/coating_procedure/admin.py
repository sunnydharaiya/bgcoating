from django.contrib import admin
from .models import ProcedureRecord


@admin.register(ProcedureRecord)
class ProcedureRecordAdmin(admin.ModelAdmin):
    list_display = ['doc_no', 'rev_no', 'project_name', 'client_name', 'status', 'is_active_draft', 'user', 'updated_at']
    list_filter = ['status', 'is_active_draft', 'created_at', 'updated_at']
    search_fields = ['doc_no', 'project_name', 'client_name', 'contractor_name', 'equipment_tag']
    readonly_fields = ['created_at', 'updated_at']
