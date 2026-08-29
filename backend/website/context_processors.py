from .models import SiteSettings, NavigationItem, TechnicalStandard


def site_settings(request):
    """Inject global SiteSettings object into all templates."""
    try:
        settings = SiteSettings.load()
    except Exception:
        settings = None
    return {'site_settings': settings}


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
