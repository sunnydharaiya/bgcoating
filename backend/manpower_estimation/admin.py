from django.contrib import admin
from .models import ManpowerRecord


@admin.register(ManpowerRecord)
class ManpowerRecordAdmin(admin.ModelAdmin):
    list_display = ('est_no', 'project_name', 'customer', 'status', 'currency', 'total_area', 'grand_total', 'cost_per_m2', 'is_active_draft', 'user', 'updated_at')
    list_filter = ('status', 'is_active_draft', 'currency', 'created_at')
    search_fields = ('est_no', 'project_name', 'customer', 'location', 'user__username')
    readonly_fields = ('created_at', 'updated_at', 'ip_address', 'user_agent')
