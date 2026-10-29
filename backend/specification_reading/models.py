from django.db import models
from django.contrib.auth.models import User


class SpecificationRecord(models.Model):
    """Flexible storage for Specification Reading dossiers, registered reports, and active working drafts."""
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='spec_reading_records')
    spec_id = models.CharField(max_length=100, db_index=True)
    din_no = models.CharField(max_length=150, blank=True)
    proj_no = models.CharField(max_length=150, blank=True, db_index=True)
    proj_desc = models.CharField(max_length=255, blank=True)
    cust_name = models.CharField(max_length=255, blank=True)
    prepared_by = models.CharField(max_length=150, blank=True)
    status = models.CharField(max_length=50, default='Draft')
    revision = models.CharField(max_length=50, default='Rev. 0')
    is_active_draft = models.BooleanField(default=False, db_index=True)
    data = models.JSONField(default=dict, help_text="Structured dossier containing all sections A-H, I, N, Company, and Watermark")
    notes = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        verbose_name = 'Specification Record'
        verbose_name_plural = 'Specification Records'

    def __str__(self):
        user_str = self.user.username if self.user else 'Guest'
        name_str = self.proj_no or self.spec_id or 'Untitled'
        return f"[{self.spec_id}] {name_str} ({self.status}) by {user_str}"
