from django.conf import settings as django_settings
from .models import SiteSettings, NavigationItem, TechnicalStandard


def site_settings(request):
    """Inject global SiteSettings object and OS URL into all templates."""
    try:
        settings = SiteSettings.load()
    except Exception:
        settings = None
    os_url = getattr(django_settings, 'OS_URL', 'http://localhost:3000')
    return {
        'site_settings': settings,
        'os_url': os_url,
    }


def navigation(request):
    """Inject header and footer navigation items into all templates."""
    try:
        header_nav = NavigationItem.objects.filter(is_header=True, parent__isnull=True).prefetch_related('children')
        footer_nav = NavigationItem.objects.filter(is_footer=True)
    except Exception:
        header_nav = []
        footer_nav = []
    return {
        'header_navigation': header_nav,
        'footer_navigation': footer_nav,
    }


def global_standards(request):
    """Inject technical standards into templates for marquee tickers."""
    try:
        standards = TechnicalStandard.objects.all()
    except Exception:
        standards = []
    return {'global_standards': standards}


def visitor_analytics(request):
    """Inject current visit and visitor hashes for frontend duration tracking."""
    return {
        'current_visit_hash': getattr(request, 'current_visit_hash', ''),
        'current_visitor_hash': getattr(request, 'current_visitor_hash', ''),
    }
