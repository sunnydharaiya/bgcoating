from django.db import models
from django.contrib.auth.models import User


class CalculatorLog(models.Model):
    """Flexible calculation log for Coating Calculator tools."""
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='coating_calculator_logs')
    tool_id = models.CharField(max_length=100, db_index=True)
    tool_name = models.CharField(max_length=200)
    category = models.CharField(max_length=100, blank=True, default='general')
    project_name = models.CharField(max_length=255, blank=True)
    client_name = models.CharField(max_length=255, blank=True)
    inputs = models.JSONField(default=dict, help_text="Flexible key-value map of tool inputs")
    results = models.JSONField(default=dict, help_text="Calculated outputs and verdicts")
    notes = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Calculator Log'
        verbose_name_plural = 'Calculator Logs'

    def __str__(self):
        user_str = self.user.username if self.user else 'Guest'
        return f"[{self.tool_id}] {self.tool_name} by {user_str} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"
