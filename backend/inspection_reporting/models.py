from django.db import models
from django.contrib.auth.models import User


class InspectionRecord(models.Model):
    """Storage for Coating Inspection Reports (CIR), Multi-stage QA/QC logs, Adhesion dossiers, and active working drafts."""
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='inspection_records')
    report_no = models.CharField(max_length=150, db_index=True)
    project_name = models.CharField(max_length=255, blank=True, db_index=True)
    project_no = models.CharField(max_length=150, blank=True)
    customer = models.CharField(max_length=255, blank=True)
    vendor = models.CharField(max_length=255, blank=True)
    work_location = models.CharField(max_length=255, blank=True)
    equipment = models.CharField(max_length=255, blank=True)
    lead_inspector = models.CharField(max_length=255, blank=True)
    lead_cert = models.CharField(max_length=150, blank=True)
    tpi_inspector = models.CharField(max_length=255, blank=True)
    tpi_agency = models.CharField(max_length=255, blank=True)
    inspection_date = models.DateField(null=True, blank=True)
    overall_compliance = models.FloatField(default=100.0)
    verdict = models.CharField(max_length=50, default='PASS')       # PASS, FAIL, PENDING
    status = models.CharField(max_length=50, default='Approved')   # Draft, Approved, Pending, Rejected
    revision = models.CharField(max_length=50, default='R0')
    is_active_draft = models.BooleanField(default=False, db_index=True)
    data = models.JSONField(default=dict, help_text="Full structured coating inspection report state (stages s1-s4, weatherSlots, surfacePrep, adhesion, photoReport, reworkLog)")
    metrics = models.JSONField(default=dict, blank=True, help_text="Summary analytics metrics and test score records")
    notes = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        verbose_name = 'Coating Inspection Record'
        verbose_name_plural = 'Coating Inspection Records'

    def __str__(self):
        user_str = self.user.username if self.user else 'Guest'
        proj_str = f" - {self.project_name}" if self.project_name else ""
        return f"[{self.report_no}]{proj_str} ({self.status}) by {user_str}"
