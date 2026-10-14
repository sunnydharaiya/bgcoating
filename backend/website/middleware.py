import logging
from .models import VisitorCount
from .geo_utils import (
    generate_visitor_hash,
    generate_visit_hash,
    get_ip_location,
    parse_device_info,
)

logger = logging.getLogger(__name__)

IGNORED_PREFIXES = (
    '/static/',
    '/media/',
    '/admin/',
    '/api/',
    '/favicon.ico',
    '/robots.txt',
)


class VisitorTrackingMiddleware:
    """
    Middleware that records each page visit into the VisitorCount model.
    Tracks total page clicks/refreshes, unique visitors based on session key / IP,
    geographic location, device details, and cryptographically generates visitor and visit hashes.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Ensure session exists before view executes so session_key is available
        if hasattr(request, 'session') and not request.session.session_key:
            try:
                request.session.save()
            except Exception:
                pass

        path = request.path or ''
        is_trackable = request.method == 'GET' and not any(path.startswith(p) for p in IGNORED_PREFIXES)

        # Pre-compute hashes and attach to request so templates and context processors have access
        visit_hash = ''
        visitor_hash = ''
        ip = ''
        if is_trackable:
            ip = self._get_client_ip(request)
            session_key = getattr(request.session, 'session_key', '') or ''
            user_agent = request.META.get('HTTP_USER_AGENT', '')
            visitor_hash = generate_visitor_hash(ip, user_agent, session_key)
            visit_hash = generate_visit_hash(visitor_hash, path)
            request.current_visitor_hash = visitor_hash
            request.current_visit_hash = visit_hash

        response = self.get_response(request)

        # Record visit for standard page views
        if is_trackable and response.status_code == 200 and visit_hash:
            try:
                self.record_visit(request, path, ip, visitor_hash, visit_hash)
                response.set_cookie('bg_visit_hash', visit_hash, max_age=86400, samesite='Lax')
                response['X-Visit-Hash'] = visit_hash
            except Exception as ex:
                logger.debug("Failed to record visitor hit: %s", ex)

        return response

    def _get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        x_real_ip = request.META.get('HTTP_X_REAL_IP')
        if x_real_ip:
            return x_real_ip.strip()
        return request.META.get('REMOTE_ADDR') or ''

    def record_visit(self, request, path, ip, visitor_hash, visit_hash):
        session_key = getattr(request.session, 'session_key', '') or ''
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        referer = request.META.get('HTTP_REFERER', '')[:500]

        loc = get_ip_location(ip)
        dev = parse_device_info(user_agent)

        VisitorCount.objects.create(
            visitor_hash=visitor_hash,
            visit_hash=visit_hash,
            ip_address=ip or None,
            session_key=session_key or None,
            page_url=path[:255],
            referer=referer,
            country=loc.get('country', '')[:100],
            country_code=loc.get('country_code', '')[:10],
            city=loc.get('city', '')[:100],
            region=loc.get('region', '')[:100],
            device_type=dev.get('device_type', 'Desktop')[:50],
            browser=dev.get('browser', '')[:50],
            os_name=dev.get('os_name', '')[:50],
            user_agent=user_agent[:500],
        )
