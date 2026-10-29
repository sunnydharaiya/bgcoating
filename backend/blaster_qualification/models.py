from django.db import models
from django.contrib.auth.models import User


class BlasterRecord(models.Model):
    """Storage for Blaster / Operator Qualification dossiers, approved certificates, and active working drafts."""
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='blaster_records')
    rep_no = models.CharField(max_length=150, db_index=True)
    operator_name = models.CharField(max_length=255, blank=True, db_index=True)
    category = models.CharField(max_length=100, default='Blaster')
    civil_id = models.CharField(max_length=150, blank=True)
    project_name = models.CharField(max_length=255, blank=True, db_index=True)
    client = models.CharField(max_length=255, blank=True)
    contractor = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=255, blank=True)
    qualification_card_no = models.CharField(max_length=150, blank=True)
    qualification_date = models.DateField(null=True, blank=True)
    next_assessment_date = models.DateField(null=True, blank=True)
    overall_score = models.FloatField(default=0.0)
    verdict = models.CharField(max_length=50, default='PENDING')  # PASS, FAIL, PENDING
    status = models.CharField(max_length=50, default='Draft')      # Draft, Approved
    revision = models.CharField(max_length=50, default='R0')
    is_active_draft = models.BooleanField(default=False, db_index=True)
    data = models.JSONField(default=dict, help_text="Full structured blaster qualification report state")
    notes = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        verbose_name = 'Blaster Qualification Record'
        verbose_name_plural = 'Blaster Qualification Records'

    def __str__(self):
        user_str = self.user.username if self.user else 'Guest'
        name_str = f"{self.operator_name} ({self.category})" if self.operator_name else self.rep_no
        return f"[{self.rep_no}] {name_str} — {self.verdict} ({self.status}) by {user_str}"
