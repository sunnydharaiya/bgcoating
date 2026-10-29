from django.contrib import admin
from .models import UnitRateRecord


@admin.register(UnitRateRecord)
class UnitRateRecordAdmin(admin.ModelAdmin):
    list_display = ['est_no', 'project_name', 'customer', 'currency', 'total_area', 'grand_total', 'status', 'is_active_draft', 'user', 'updated_at']
    list_filter = ['status', 'currency', 'is_active_draft', 'created_at', 'updated_at']
    search_fields = ['est_no', 'project_name', 'customer', 'location', 'estimator']
    readonly_fields = ['created_at', 'updated_at']
