from django.db import models
from django.contrib.auth.models import User


class ProcedureRecord(models.Model):
    """Flexible storage for Coating Procedure dossiers, registered procedures, and active working drafts."""
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='procedure_records')
    doc_no = models.CharField(max_length=150, db_index=True)
    rev_no = models.CharField(max_length=50, default='0')
    doc_title = models.CharField(max_length=255, blank=True, default='Painting Procedure & Coating Specification')
    project_name = models.CharField(max_length=255, blank=True, db_index=True)
    client_name = models.CharField(max_length=255, blank=True)
    contractor_name = models.CharField(max_length=255, blank=True)
    facility_location = models.CharField(max_length=255, blank=True)
    equipment_tag = models.CharField(max_length=150, blank=True)
    project_number = models.CharField(max_length=150, blank=True)
    site_location = models.CharField(max_length=255, blank=True)
    prepared_by = models.CharField(max_length=150, blank=True)
    status = models.CharField(max_length=50, default='Draft')
    revision = models.CharField(max_length=50, default='Rev. 0')
    is_active_draft = models.BooleanField(default=False, db_index=True)
    data = models.JSONField(default=dict, help_text="Full structured coating procedure state (sections 1-11, annexures, metadata)")
    notes = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        verbose_name = 'Procedure Record'
        verbose_name_plural = 'Procedure Records'

    def __str__(self):
        user_str = self.user.username if self.user else 'Guest'
        name_str = self.project_name or self.doc_no or 'Untitled'
        return f"[{self.doc_no}] {name_str} ({self.status}) by {user_str}"
