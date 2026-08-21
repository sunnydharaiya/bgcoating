from django.db import models
from django.contrib.auth.models import User


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
    footer_description = models.TextField(
        default="BG Group of Paint & Coating Consultant is a Surat, Gujarat based surface treatment and protective coating consultancy serving refinery, oil & gas, petrochemical and heavy-engineering clients. From surface preparation, abrasive blasting and industrial painting to corrosion assessment, coating inspection, coating training and digital coating solutions — we protect the assets that power industry."
    )
    copyright_text = models.CharField(
        max_length=255,
        default="© 2026 BG GROUP OF PAINT & COATINGS CONSULTANT · ALL RIGHTS RESERVED · SITE BY TRYON INFOSOFT"
    )

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
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = "Client Testimonial"
        verbose_name_plural = "Client Testimonials"

    def __str__(self):
        return f"{self.client_name} - {self.company_name}"


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


