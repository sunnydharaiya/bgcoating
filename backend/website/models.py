from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class SiteSettings(models.Model):
    """Singleton model storing global branding, contact details, working hours, and social media URLs."""
    site_name = models.CharField(max_length=255, default="BG Group Of Paint & Coatings Consultant")
    tagline = models.CharField(max_length=255, default="Industrial Coating Intelligence · Since 2004")
    logo = models.ImageField(upload_to='site/', blank=True, null=True, help_text="Header brand logo image")
    footer_logo = models.ImageField(upload_to='site/', blank=True, null=True, help_text="Footer logo image")
    phone_number = models.CharField(max_length=50, default="+91-99258-10408")
    whatsapp_number = models.CharField(max_length=50, default="919925810408")
    primary_email = models.EmailField(default="inquiry.bggroup@gmail.com")
    support_email = models.EmailField(default="support@bgcoating.com")
    office_address = models.TextField(default="E 103, Akash Echo Point, Bhimrad, Surat – 395007, Gujarat, India")
    working_hours = models.CharField(max_length=150, default="Mon – Sat · 09:00 am – 06:00 pm")
    facebook_url = models.URLField(blank=True, default="https://www.facebook.com/bggroupcoatingsolutions")
    instagram_url = models.URLField(blank=True, default="https://www.instagram.com/bggroupcoatingsolutions/")
    youtube_url = models.URLField(blank=True, default="https://www.youtube.com/@bggroupcoatingconsultant")
    linkedin_url = models.URLField(blank=True, default="https://www.linkedin.com/company/bggroupofpaintandcoatingconsultant/")
    pinterest_url = models.URLField(blank=True, default="https://www.pinterest.com/bgcoatingconsultant/")
    career_form_url = models.URLField(default="https://forms.gle/v6kCBLKYeeUtMPky8")
    google_review_url = models.URLField(
        default="https://www.google.com/search?q=BG+Group+of+Paint+and+Coating+Consultant+Surat+reviews",
        blank=True,
        help_text="Direct link for clients to write/read Google Reviews"
    )
    footer_description = models.TextField(
        default="BG Group of Paint & Coating Consultant is a Surat, Gujarat based surface treatment and protective coating consultancy serving refinery, oil & gas, petrochemical and heavy-engineering clients. From surface preparation, abrasive blasting and industrial painting to corrosion assessment, coating inspection, coating training and digital coating solutions — we protect the assets that power industry."
    )
    copyright_text = models.CharField(
        max_length=255,
        default="© 2026 BG GROUP OF PAINT & COATINGS CONSULTANT · ALL RIGHTS RESERVED · SITE BY TRYON INFOSOFT"
    )

    # Dynamic Trust Dashboard Metrics
    total_visitors_baseline = models.PositiveIntegerField(default=0, help_text="Optional baseline offset for Total Visitors (0 for pure visitor count)")
    unique_visitors_baseline = models.PositiveIntegerField(default=0, help_text="Optional baseline offset for Unique Visitors (0 for pure visitor count)")
    total_enquiries_baseline = models.PositiveIntegerField(default=0, help_text="Optional baseline offset for Total Enquiries (0 for pure contact count)")
    customer_feedback_baseline = models.PositiveIntegerField(default=0, help_text="Optional baseline offset for Customer Feedback (0 for pure testimonial count)")

    @property
    def total_visitors(self):
        try:
            from .models import VisitorCount
            v_count = VisitorCount.objects.count()
        except Exception:
            v_count = 0
        return (self.total_visitors_baseline or 0) + v_count

    @property
    def total_visitors_count(self):
        return f"{self.total_visitors:,}"

    @property
    def unique_visitors(self):
        try:
            from .models import VisitorCount
            # Count distinct visitors by session_key or IP
            u_count = VisitorCount.objects.exclude(session_key__isnull=True).exclude(session_key='').values('session_key').distinct().count()
            if u_count == 0:
                u_count = VisitorCount.objects.exclude(ip_address__isnull=True).values('ip_address').distinct().count()
        except Exception:
            u_count = 0
        return (self.unique_visitors_baseline or 0) + u_count

    @property
    def unique_visitors_count(self):
        return f"{self.unique_visitors:,}"

    @property
    def total_enquiries(self):
        try:
            from .models import ContactSubmission
            sub_count = ContactSubmission.objects.count()
        except Exception:
            sub_count = 0
        return (self.total_enquiries_baseline or 0) + sub_count

    @property
    def enquiries_count(self):
        return f"{self.total_enquiries:,}"

    @property
    def customer_feedback(self):
        try:
            from .models import ClientTestimonial
            t_count = ClientTestimonial.objects.count()
        except Exception:
            t_count = 0
        return (self.customer_feedback_baseline or 0) + t_count

    @property
    def customer_feedback_count(self):
        return self.customer_feedback

    @property
    def feedback_count(self):
        return f"{self.customer_feedback:,}"

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

    def save(self, *args, **kwargs):
        # Enforce singleton instance
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return self.site_name


class PageSEO(models.Model):
    """SEO Metadata for static and dynamic page routes."""
    PAGE_CHOICES = [
        ('home', 'Homepage'),
        ('about', 'About Us'),
        ('services', 'Services Hub'),
        ('blog', 'Blog Knowledge Hub'),
        ('gallery', 'Project Gallery'),
        ('contact', 'Contact Us'),
        ('board', 'Board Team'),
        ('thank_you', 'Thank You'),
    ]

    page_identifier = models.CharField(max_length=50, choices=PAGE_CHOICES, unique=True)
    meta_title = models.CharField(max_length=255)
    meta_description = models.TextField()
    canonical_url = models.URLField()
    og_image = models.ImageField(upload_to='seo/', blank=True, null=True)
    robots = models.CharField(max_length=50, default='index, follow')

    class Meta:
        verbose_name = "Page SEO Metadata"
        verbose_name_plural = "Page SEO Metadata"

    def __str__(self):
        return f"SEO: {self.get_page_identifier_display()}"


class NavigationItem(models.Model):
    """Header, Mobile Drawer, and Footer Navigation Items."""
    title = models.CharField(max_length=100)
    url = models.CharField(max_length=255, help_text="Can be a relative URL (e.g. /about/) or dynamic route name")
    order = models.IntegerField(default=0)
    is_header = models.BooleanField(default=True)
    is_footer = models.BooleanField(default=True)
    is_external = models.BooleanField(default=False)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')

    class Meta:
        ordering = ['order', 'id']
        verbose_name = "Navigation Item"
        verbose_name_plural = "Navigation Items"

    def __str__(self):
        return self.title


class ServiceCategory(models.Model):
    """Category grouping for industrial coating services."""
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = "Service Category"
        verbose_name_plural = "Service Categories"

    def __str__(self):
        return self.name


class Service(models.Model):
    """Detailed Industrial Coating Service offering."""
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    category = models.ForeignKey(ServiceCategory, on_delete=models.CASCADE, related_name='services')
    excerpt = models.TextField()
    description = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to='services/', blank=True, null=True, help_text="Cover hero image for service exploration")
    thumbnail_image = models.ImageField(upload_to='services/thumbnails/', blank=True, null=True, help_text="Card thumbnail image for homepage & services listing (any size)")
    full_content = models.TextField(blank=True, help_text="Detailed rich HTML content for explore service page")
    standard_code = models.CharField(max_length=100, blank=True, help_text="Associated standard, e.g. ISO 12944, NACE, AMPP")
    icon_svg = models.TextField(blank=True, help_text="Inline SVG or icon CSS class")
    is_featured = models.BooleanField(default=False)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'title']
        verbose_name = "Service Offering"
        verbose_name_plural = "Service Offerings"

    def __str__(self):
        return self.title

    @property
    def image_url(self):
        """Dynamic URL for the service cover image, handling media uploads and static fallbacks."""
        if self.cover_image:
            try:
                name = self.cover_image.name
                if name.startswith('http://') or name.startswith('https://'):
                    return name
                if 'assets/images' in name:
                    from django.templatetags.static import static
                    return static(name)
                return self.cover_image.url
            except Exception:
                pass
        return None

    @property
    def thumbnail_url(self):
        """Dynamic URL for the card thumbnail image, with fallback to image_url (cover_image)."""
        if self.thumbnail_image:
            try:
                name = self.thumbnail_image.name
                if name.startswith('http://') or name.startswith('https://'):
                    return name
                if 'assets/images' in name:
                    from django.templatetags.static import static
                    return static(name)
                return self.thumbnail_image.url
            except Exception:
                pass
        return self.image_url


class BlogPost(models.Model):
    """Technical blog article / guide entry."""
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    category_name = models.CharField(max_length=100, help_text="e.g. Surface Preparation, Inspection, Corrosion")
    publish_date = models.DateField()
    read_time_minutes = models.IntegerField(default=5)
    excerpt = models.TextField()
    content = models.TextField(blank=True)
    featured_image = models.ImageField(upload_to='blog/')
    search_keywords = models.TextField(blank=True, help_text="Comma/space separated terms for search filter matching")
    external_url = models.URLField(blank=True, null=True, help_text="Optional link if article detail is hosted externally")
    is_featured = models.BooleanField(default=False, help_text="Highlight as Editor's Choice article")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-publish_date', '-id']
        verbose_name = "Blog Article"
        verbose_name_plural = "Blog Articles"

    def __str__(self):
        return self.title


class ProjectGallery(models.Model):
    """Project portfolio item and visual reference standard."""
    title = models.CharField(max_length=255)
    client_category = models.CharField(max_length=100, help_text="e.g. Protective Coatings, Inspection & QA/QC, Refinery")
    location_name = models.CharField(max_length=100, help_text="e.g. Technical Reference, Refinery Site, Plant Facility")
    service_type = models.CharField(max_length=100, help_text="e.g. Coating System Selection, Condition Survey")
    summary = models.TextField()
    standard = models.CharField(max_length=100, help_text="e.g. ISO 12944, SSPC-VIS 1, NACE")
    image = models.ImageField(upload_to='gallery/')
    filter_tag = models.CharField(max_length=50, default="all", help_text="Tag matching filter buttons (e.g. surface, inspection, refinery)")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = "Project Gallery Item"
        verbose_name_plural = "Project Gallery Items"

    def __str__(self):
        return self.title


class BoardMember(models.Model):
    """Board team & leadership profile."""
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=150)
    certification = models.CharField(max_length=200, blank=True, help_text="e.g. NACE Level 3 / AMPP Certified")
    bio = models.TextField()
    photo = models.ImageField(upload_to='board/')
    display_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'name']
        verbose_name = "Board Member"
        verbose_name_plural = "Board Members"

    def __str__(self):
        return self.name


class EducationItem(models.Model):
    """Education qualification and credential item for board timeline."""
    program_title = models.CharField(max_length=255, help_text="e.g. PG Program — Corrosion Management & Technology")
    institution = models.CharField(max_length=255, help_text="e.g. Indian Institute of Technology (IIT) Ropar · with CII")
    period_date = models.CharField(max_length=100, help_text="e.g. Nov 2024 – Oct 2025 · Completed")
    description = models.TextField(blank=True, help_text="Executive summary / course description")
    certificate_image = models.ImageField(upload_to='education/', blank=True, null=True, help_text="Certificate scan/image")
    img_key = models.CharField(max_length=50, blank=True, help_text="Unique key for lightbox viewer (e.g. edu_iit)")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = "Education Timeline Item"
        verbose_name_plural = "Education Timeline Items"

    def __str__(self):
        return f"{self.program_title} ({self.institution})"


class CertificationItem(models.Model):
    """Certification gallery credential item for board & credentials page."""
    title = models.CharField(max_length=255, help_text="e.g. NACE Coating Inspector Level 2")
    issuing_org = models.CharField(max_length=255, help_text="e.g. NACE International Institute")
    category_badge = models.CharField(max_length=100, blank=True, help_text="e.g. International, Specialist, Digital, Verified")
    validity_date = models.CharField(max_length=255, help_text="e.g. Cert No. 20438 · Expires August 2, 2028")
    description = models.TextField(blank=True, help_text="Detailed description paragraph")
    certificate_image = models.ImageField(upload_to='certifications/', blank=True, null=True, help_text="Certificate scan/image")
    img_key = models.CharField(max_length=50, blank=True, help_text="Unique key for lightbox viewer (e.g. cert_nace2)")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = "Certification Item"
        verbose_name_plural = "Certification Items"

    def __str__(self):
        return f"{self.title} ({self.issuing_org})"



class ClientTestimonial(models.Model):
    """Client review and endorsement."""
    client_name = models.CharField(max_length=100)
    client_role = models.CharField(max_length=150)
    company_name = models.CharField(max_length=150)
    testimonial_text = models.TextField()
    rating = models.IntegerField(default=5)
    client_photo = models.ImageField(upload_to='testimonials/', blank=True, null=True, help_text="Uploaded client avatar")
    client_avatar = models.CharField(max_length=255, blank=True, help_text="Static asset image filename e.g. Nirav_Lad___Image.png")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = "Client Testimonial"
        verbose_name_plural = "Client Testimonials"

    def __str__(self):
        return f"{self.client_name} - {self.company_name}"

    @property
    def avatar_url(self):
        """Dynamic URL for testimonial avatar, supporting uploaded photos and static avatars."""
        if self.client_photo:
            try:
                return self.client_photo.url
            except Exception:
                pass
        if self.client_avatar:
            from django.templatetags.static import static
            return static(f"assets/images/{self.client_avatar}")
        from django.templatetags.static import static
        return static("assets/images/unnamed.png")


class TechnicalStandard(models.Model):
    """Technical standard & certifying framework (e.g. ISO 12944, NACE, AMPP, SSPC, ASTM)."""
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    badge_icon = models.ImageField(upload_to='standards/', blank=True, null=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'code']
        verbose_name = "Technical Standard"
        verbose_name_plural = "Technical Standards"

    def __str__(self):
        return f"{self.code} - {self.name}"


class Industry(models.Model):
    """Industry sector served (e.g. Oil & Gas, Refinery, Marine, Power)."""
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    icon_svg = models.TextField(blank=True, help_text="SVG icon markup for industry card")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = "Industry Sector"
        verbose_name_plural = "Industry Sectors"

    def __str__(self):
        return self.name


class ContactSubmission(models.Model):
    """Form submissions from technical consultation requests."""
    full_name = models.CharField(max_length=150)
    company = models.CharField(max_length=150, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    service_of_interest = models.CharField(max_length=150)
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-submitted_at']
        verbose_name = "Contact Submission"
        verbose_name_plural = "Contact Submissions"

    def __str__(self):
        return f"{self.full_name} ({self.service_of_interest}) - {self.submitted_at.strftime('%Y-%m-%d %H:%M')}"


class VisitorCount(models.Model):
    """Tracks visitor page hits across the platform with location, duration, and cryptographic hashes."""
    visitor_hash = models.CharField(max_length=64, blank=True, db_index=True, help_text="Unique hash identifier per visitor/device")
    visit_hash = models.CharField(max_length=64, blank=True, db_index=True, help_text="Unique hash identifier per page visit")
    ip_address = models.GenericIPAddressField(null=True, blank=True, db_index=True)
    session_key = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    page_url = models.CharField(max_length=255, blank=True)
    page_title = models.CharField(max_length=255, blank=True)
    referer = models.CharField(max_length=500, blank=True)

    # Location from IP
    country = models.CharField(max_length=100, blank=True, default='')
    country_code = models.CharField(max_length=10, blank=True, default='')
    city = models.CharField(max_length=100, blank=True, default='')
    region = models.CharField(max_length=100, blank=True, default='')

    # Device & client info
    user_agent = models.TextField(blank=True)
    device_type = models.CharField(max_length=50, blank=True, default='Desktop')
    browser = models.CharField(max_length=50, blank=True, default='')
    os_name = models.CharField(max_length=50, blank=True, default='')

    # Time stayed / duration
    duration_seconds = models.PositiveIntegerField(default=0, help_text="Time stayed on page in seconds")

    visited_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-visited_at']
        verbose_name = "Visitor Log"
        verbose_name_plural = "Visitor Logs"

    def __str__(self):
        loc = f" ({self.city}, {self.country})" if self.city and self.country else ""
        return f"{self.page_url} - {self.ip_address}{loc} [{self.short_visitor_hash}]"

    @property
    def duration_display(self):
        secs = self.duration_seconds or 0
        if secs < 60:
            return f"{secs}s"
        mins = secs // 60
        rem_secs = secs % 60
        if mins < 60:
            return f"{mins}m {rem_secs}s" if rem_secs else f"{mins}m"
        hours = mins // 60
        rem_mins = mins % 60
        return f"{hours}h {rem_mins}m"

    @property
    def location_display(self):
        parts = [p for p in (self.city, self.country) if p and p != 'Unknown']
        return ", ".join(parts) if parts else (self.country or "Unknown")

    @property
    def short_visitor_hash(self):
        return self.visitor_hash[:10] if self.visitor_hash else '-'

    @property
    def short_visit_hash(self):
        return self.visit_hash[:10] if self.visit_hash else '-'


VisitorLog = VisitorCount
Visitor = VisitorCount


class UserProject(models.Model):
    """Saved calculation project created by authenticated users or guest session."""
    title = models.CharField(max_length=255)
    client_name = models.CharField(max_length=255, blank=True)
    facility_location = models.CharField(max_length=255, blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='calculator_projects')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        verbose_name = "User Calculator Project"
        verbose_name_plural = "User Calculator Projects"

    def __str__(self):
        return f"{self.title} ({self.client_name or 'General'})"


class CalculationLog(models.Model):
    """Audit log recording every calculation execution, input parameters, and output metrics."""
    CALCULATOR_CHOICES = [
        ('tank_shell', 'Storage Tank Shell'),
        ('tank_roof', 'Storage Tank Roof'),
        ('pipe_spool', 'Pipe Spool System'),
        ('structural_beam', 'Structural Steel Work'),
        ('abrasive_blasting', 'Abrasive Blasting Consumption'),
        ('dft_volume_solids', 'DFT & Paint Coverage Matrix'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='calculation_logs')
    project = models.ForeignKey(UserProject, on_delete=models.SET_NULL, null=True, blank=True, related_name='calculation_logs')
    calculator_type = models.CharField(max_length=50, choices=CALCULATOR_CHOICES)
    input_data = models.JSONField(help_text="Exact input parameters (dimensions, DFT, loss %, unit system)")
    result_data = models.JSONField(help_text="Calculated engineering outputs (area, paint liters, abrasive tons)")
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Calculation Audit Log"
        verbose_name_plural = "Calculation Audit Logs"

    def __str__(self):
        user_str = self.user.username if self.user else 'Guest'
        return f"[{self.get_calculator_type_display()}] by {user_str} on {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class PaintProduct(models.Model):
    """Catalog of industrial coating products for dropdown calculation lookup."""
    name = models.CharField(max_length=255)
    manufacturer = models.CharField(max_length=150, help_text="e.g. Jotun, Hempel, International, AkzoNobel, Asian Paints")
    volume_solids_pct = models.FloatField(default=60.0, help_text="Volume Solids % (e.g. 65.0)")
    specific_gravity = models.FloatField(default=1.3, help_text="Specific gravity (g/cm³)")
    default_dft_microns = models.IntegerField(default=75, help_text="Recommended Dry Film Thickness (µm)")
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['manufacturer', 'name']
        verbose_name = "Paint Product Spec"
        verbose_name_plural = "Paint Product Specs"

    def __str__(self):
        return f"{self.manufacturer} — {self.name} (VS {self.volume_solids_pct}%)"


class UserProfile(models.Model):
    """Extended profile for calculator users storing credentials, organization, engineering & settings preferences."""
    AUTH_PROVIDER_CHOICES = [
        ('email', 'Email / Password'),
        ('google', 'Google OAuth'),
        ('microsoft', 'Microsoft OAuth'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    auth_provider = models.CharField(max_length=50, choices=AUTH_PROVIDER_CHOICES, default='email')
    avatar_url = models.TextField(blank=True, null=True, help_text="Avatar image URL or data URI")
    google_id = models.CharField(max_length=255, blank=True, null=True, unique=True)
    
    # Membership & Pro Access
    is_pro = models.BooleanField(default=False, help_text="Pro membership granting access to Executive PRO modules")
    pro_activated_at = models.DateTimeField(null=True, blank=True)
    
    # Personal & Identity
    full_name = models.CharField(max_length=255, blank=True)
    mobile = models.CharField(max_length=30, blank=True)
    country_code = models.CharField(max_length=10, default='+91')
    designation = models.CharField(max_length=150, blank=True, default='Senior Coating Inspector & Consultant')
    department = models.CharField(max_length=150, blank=True, default='QA / QC & Protective Coatings')
    emp_id = models.CharField(max_length=50, blank=True)
    role = models.CharField(max_length=100, default='Coating Inspector')
    
    # Organization Details
    company = models.CharField(max_length=255, blank=True, default='BG Coating & Inspection Services')
    bu = models.CharField(max_length=255, blank=True, help_text="Business Unit")
    office_location = models.CharField(max_length=255, blank=True)
    branch = models.CharField(max_length=100, blank=True)
    website = models.CharField(max_length=255, blank=True)
    
    # Alternate Contact & Address
    alt_mobile = models.CharField(max_length=30, blank=True)
    alt_email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, default='India')
    zip_code = models.CharField(max_length=20, blank=True)
    
    # Professional Qualifications
    experience_years = models.IntegerField(default=0)
    discipline = models.CharField(max_length=150, blank=True, default='Corrosion / Materials')
    expertise = models.TextField(blank=True)
    certifications = models.JSONField(default=list, blank=True, help_text="List of certifications e.g. ['AMPP', 'NACE']")
    preferred_standards = models.JSONField(default=list, blank=True, help_text="Preferred standards e.g. ['ISO', 'ASTM']")
    
    # Workspace & Calculation Preferences
    default_dashboard = models.CharField(max_length=100, default='coating-calculator')
    unit_system = models.CharField(max_length=50, default='Metric (SI)')
    language = models.CharField(max_length=50, default='English')
    theme = models.CharField(max_length=50, default='Light')
    time_zone = models.CharField(max_length=100, default='Asia/Kolkata (GMT+5:30)')
    date_format = models.CharField(max_length=50, default='DD/MM/YYYY')
    
    # Activity tracking
    last_login_at = models.DateTimeField(null=True, blank=True)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"

    def __str__(self):
        name_display = self.full_name or self.user.get_full_name() or self.user.username
        return f"{name_display} ({self.user.email or self.user.username}) - [{self.auth_provider}]"


@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    """Automatically create or update UserProfile whenever User is created/saved."""
    if created:
        full_name = f"{instance.first_name} {instance.last_name}".strip()
        UserProfile.objects.create(
            user=instance,
            full_name=full_name or instance.username,
        )
    else:
        # Ensure profile exists if user was created earlier without one
        if not hasattr(instance, 'profile'):
            full_name = f"{instance.first_name} {instance.last_name}".strip()
            UserProfile.objects.create(
                user=instance,
                full_name=full_name or instance.username,
            )


