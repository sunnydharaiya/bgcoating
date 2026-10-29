from django.db import models
from django.contrib.auth.models import User


class UnitRateRecord(models.Model):
    """Flexible storage for Unit-Rate commercial proposals, registered quotations, and active working drafts."""
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='unit_rate_records')
    est_no = models.CharField(max_length=150, db_index=True)
    project_name = models.CharField(max_length=255, blank=True, db_index=True)
    customer = models.CharField(max_length=255, blank=True)
    currency = models.CharField(max_length=10, default='INR')
    location = models.CharField(max_length=255, blank=True)
    estimator = models.CharField(max_length=150, blank=True)
    total_area = models.FloatField(default=0.0)
    grand_total = models.FloatField(default=0.0)
    cost_per_m2 = models.FloatField(default=0.0)
    status = models.CharField(max_length=50, default='Draft')
    revision = models.CharField(max_length=50, default='Rev. 0')
    is_active_draft = models.BooleanField(default=False, db_index=True)
    data = models.JSONField(default=dict, help_text="Full structured unit rate estimation state (Sections 1-6, rows, metrics, metadata)")
    notes = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        verbose_name = 'Unit-Rate Record'
        verbose_name_plural = 'Unit-Rate Records'

    def __str__(self):
        user_str = self.user.username if self.user else 'Guest'
        name_str = self.project_name or self.est_no or 'Untitled'
        return f"[{self.est_no}] {name_str} ({self.status}) by {user_str}"
