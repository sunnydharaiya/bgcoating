import hashlib
import ipaddress
import json
import logging
import re
import urllib.request
from datetime import datetime
from django.core.cache import cache

logger = logging.getLogger(__name__)


def generate_visitor_hash(ip, user_agent, session_key=''):
    """Generate a consistent unique cryptographic hash for a visitor/device."""
    raw = f"{ip or 'unknown'}|{user_agent or 'unknown'}|{session_key or ''}"
    return hashlib.sha256(raw.encode('utf-8')).hexdigest()[:24]


def generate_visit_hash(visitor_hash, page_url, timestamp=None):
    """Generate a unique cryptographic hash for a specific page entry/hit."""
    ts = timestamp or datetime.now().isoformat()
    raw = f"{visitor_hash}|{page_url}|{ts}"
    return hashlib.sha256(raw.encode('utf-8')).hexdigest()[:32]


def parse_device_info(user_agent):
    """Extract device type, browser, and OS name from user agent string."""
    ua = user_agent or ''
    
    # Device Type
    device_type = 'Desktop'
    if re.search(r'iPad|Tablet|PlayBook', ua, re.I):
        device_type = 'Tablet'
    elif re.search(r'Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini', ua, re.I):
        device_type = 'Mobile'

    # Browser
    browser = 'Other'
    if 'Edg/' in ua:
        browser = 'Microsoft Edge'
    elif 'Chrome/' in ua and 'Safari/' in ua:
        browser = 'Chrome'
    elif 'Safari/' in ua and 'Chrome/' not in ua:
        browser = 'Safari'
    elif 'Firefox/' in ua:
        browser = 'Firefox'
    elif 'MSIE' in ua or 'Trident/' in ua:
        browser = 'Internet Explorer'
    elif 'Opera' in ua or 'OPR/' in ua:
        browser = 'Opera'

    # Operating System
    os_name = 'Other'
    if 'Windows' in ua:
        os_name = 'Windows'
    elif 'Macintosh' in ua or 'Mac OS X' in ua:
        os_name = 'macOS'
    elif 'Android' in ua:
        os_name = 'Android'
    elif 'iPhone' in ua or 'iPad' in ua:
        os_name = 'iOS'
    elif 'Linux' in ua:
        os_name = 'Linux'

    return {
        'device_type': device_type,
        'browser': browser,
        'os_name': os_name,
    }


def get_ip_location(ip):
    """
    Look up geographical location (country, country code, city, region) from IP.
    Uses in-memory cache and handles localhost/private IPs gracefully.
    """
    if not ip or ip in ('127.0.0.1', '::1', 'localhost'):
        return {
            'country': 'Localhost',
            'country_code': 'LOC',
            'city': 'Local Development',
            'region': 'Local',
        }

    # Check if IP is private (RFC 1918, CGNAT, etc.)
    try:
        ip_obj = ipaddress.ip_address(ip)
        if ip_obj.is_private or ip_obj.is_loopback or ip_obj.is_reserved:
            return {
                'country': 'Local Network',
                'country_code': 'LAN',
                'city': 'Private IP',
                'region': 'Local',
            }
    except ValueError:
        pass

    # Check cache (24 hours)
    cache_key = f"bg_geoip_{ip.replace(':', '_')}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    # Query public GeoIP service with 1.8s timeout
    try:
        url = f"http://ip-api.com/json/{ip}?fields=status,country,countryCode,regionName,city"
        req = urllib.request.Request(url, headers={'User-Agent': 'BGCoating-Analytics/1.0'})
        with urllib.request.urlopen(req, timeout=1.8) as resp:
            if resp.status == 200:
                data = json.loads(resp.read().decode('utf-8'))
                if data.get('status') == 'success':
                    result = {
                        'country': data.get('country') or 'Unknown',
                        'country_code': data.get('countryCode') or '',
                        'city': data.get('city') or 'Unknown',
                        'region': data.get('regionName') or '',
                    }
                    cache.set(cache_key, result, 86400)
                    return result
    except Exception as ex:
        logger.debug("GeoIP lookup failed for %s: %s", ip, ex)

    fallback = {
        'country': 'Unknown',
        'country_code': '',
        'city': 'Unknown',
        'region': '',
    }
    cache.set(cache_key, fallback, 3600)
    return fallback
