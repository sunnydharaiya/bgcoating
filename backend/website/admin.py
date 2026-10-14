from django.contrib import admin
from .models import (
    SiteSettings,
    PageSEO,
    NavigationItem,
    ServiceCategory,
    Service,
    BlogPost,
    ProjectGallery,
    BoardMember,
    EducationItem,
    CertificationItem,
    ClientTestimonial,
    TechnicalStandard,
    Industry,
    ContactSubmission,
    VisitorCount,
)


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ('site_name', 'phone_number', 'total_visitors_baseline', 'unique_visitors_baseline', 'total_enquiries_baseline', 'customer_feedback_baseline')
    fieldsets = (
        ("Branding & Identification", {
            'fields': ('site_name', 'tagline', 'logo', 'footer_logo', 'footer_description', 'copyright_text')
        }),
        ("Contact & Hours", {
            'fields': ('phone_number', 'whatsapp_number', 'primary_email', 'support_email', 'office_address', 'working_hours')
        }),
        ("Social Links & Forms", {
            'fields': ('facebook_url', 'instagram_url', 'youtube_url', 'linkedin_url', 'pinterest_url', 'career_form_url')
        }),
        ("Trust Dashboard Metrics (Homepage)", {
            'description': "Optional baseline numbers added to dynamic table counts. Set 0 to display pure live counts from database tables.",
            'fields': (
                ('total_visitors_baseline', 'unique_visitors_baseline'),
                ('total_enquiries_baseline', 'customer_feedback_baseline'),
            )
        }),
    )

    def has_add_permission(self, request):
        # Enforce singleton pattern in admin
        if SiteSettings.objects.exists():
            return False
        return super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(PageSEO)
class PageSEOAdmin(admin.ModelAdmin):
    list_display = ('page_identifier', 'meta_title', 'canonical_url', 'robots')
    list_filter = ('page_identifier', 'robots')
    search_fields = ('meta_title', 'meta_description', 'canonical_url')


@admin.register(NavigationItem)
class NavigationItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'url', 'order', 'is_header', 'is_footer', 'is_external', 'parent')
    list_filter = ('is_header', 'is_footer', 'is_external')
    list_editable = ('order', 'is_header', 'is_footer', 'is_external')
    search_fields = ('title', 'url')


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'order')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('order',)
    search_fields = ('name', 'description')


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'standard_code', 'is_featured', 'order')
    prepopulated_fields = {'slug': ('title',)}
    list_filter = ('category', 'is_featured')
    list_editable = ('is_featured', 'order')
    search_fields = ('title', 'excerpt', 'description', 'standard_code')


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category_name', 'publish_date', 'read_time_minutes', 'is_featured')
    prepopulated_fields = {'slug': ('title',)}
    list_filter = ('category_name', 'is_featured', 'publish_date')
    list_editable = ('is_featured',)
    search_fields = ('title', 'excerpt', 'search_keywords', 'content')
    date_hierarchy = 'publish_date'


@admin.register(ProjectGallery)
class ProjectGalleryAdmin(admin.ModelAdmin):
    list_display = ('title', 'client_category', 'location_name', 'standard', 'filter_tag', 'order')
    list_filter = ('filter_tag', 'client_category', 'standard')
    list_editable = ('order', 'filter_tag')
    search_fields = ('title', 'summary', 'location_name', 'standard')


@admin.register(BoardMember)
class BoardMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'certification', 'display_order')
    list_editable = ('display_order',)
    search_fields = ('name', 'role', 'certification', 'bio')


@admin.register(EducationItem)
class EducationItemAdmin(admin.ModelAdmin):
    list_display = ('program_title', 'institution', 'period_date', 'order')
    list_editable = ('order',)
    search_fields = ('program_title', 'institution', 'description')


@admin.register(CertificationItem)
class CertificationItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'issuing_org', 'category_badge', 'validity_date', 'order')
    list_editable = ('order',)
    search_fields = ('title', 'issuing_org', 'description', 'category_badge')



@admin.register(ClientTestimonial)
class ClientTestimonialAdmin(admin.ModelAdmin):
    list_display = ('client_name', 'company_name', 'client_role', 'client_avatar', 'rating', 'order')
    list_editable = ('order', 'rating')
    search_fields = ('client_name', 'company_name', 'client_role', 'testimonial_text')


@admin.register(TechnicalStandard)
class TechnicalStandardAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'order')
    list_editable = ('order',)
    search_fields = ('code', 'name', 'description')


@admin.register(Industry)
class IndustryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'order')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('order',)
    search_fields = ('name',)


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'phone', 'service_of_interest', 'submitted_at')
    list_filter = ('service_of_interest', 'submitted_at')
    search_fields = ('full_name', 'company', 'email', 'phone', 'message', 'service_of_interest')
    readonly_fields = ('full_name', 'company', 'email', 'phone', 'service_of_interest', 'message', 'submitted_at')
    date_hierarchy = 'submitted_at'

    def has_add_permission(self, request):
        return False


from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'auth_provider', 'role', 'company', 'mobile', 'last_login_at', 'created_at')
    list_filter = ('auth_provider', 'role', 'created_at')
    search_fields = ('user__username', 'user__email', 'full_name', 'company', 'mobile')
    readonly_fields = ('created_at', 'updated_at')


from django.utils.html import format_html


@admin.register(VisitorCount)
class VisitorCountAdmin(admin.ModelAdmin):
    list_display = (
        'visited_at',
        'visitor_hash_badge',
        'visit_hash_badge',
        'page_url_link',
        'location_badge',
        'duration_display',
        'device_type',
        'browser',
        'ip_address',
    )
    list_filter = ('visited_at', 'country', 'city', 'device_type', 'browser')
    search_fields = ('visitor_hash', 'visit_hash', 'page_url', 'ip_address', 'city', 'country', 'referer')
    readonly_fields = (
        'visitor_hash',
        'visit_hash',
        'ip_address',
        'session_key',
        'page_url',
        'page_title',
        'referer',
        'country',
        'country_code',
        'city',
        'region',
        'device_type',
        'browser',
        'os_name',
        'duration_seconds',
        'user_agent',
        'visited_at',
        'updated_at',
    )
    date_hierarchy = 'visited_at'

    def has_add_permission(self, request):
        return False

    @admin.display(description="Page Visited")
    def page_url_link(self, obj):
        if not obj.page_url:
            return "-"
        return format_html(
            '<a href="{0}" target="_blank" style="font-weight:600;color:#2563eb;">{0}</a>',
            obj.page_url
        )

    @admin.display(description="Visitor Hash")
    def visitor_hash_badge(self, obj):
        if not obj.visitor_hash:
            return "-"
        return format_html(
            '<code style="background:#eff6ff;color:#1e40af;padding:2px 6px;border-radius:4px;font-size:11px;">{}</code>',
            obj.short_visitor_hash
        )

    @admin.display(description="Visit Hash")
    def visit_hash_badge(self, obj):
        if not obj.visit_hash:
            return "-"
        return format_html(
            '<code style="background:#f1f5f9;color:#475569;padding:2px 6px;border-radius:4px;font-size:11px;">{}</code>',
            obj.short_visit_hash
        )

    @admin.display(description="Location")
    def location_badge(self, obj):
        loc = obj.location_display
        return format_html(
            '<span style="background:#f8fafc;border:1px solid #e2e8f0;padding:2px 6px;border-radius:4px;font-size:12px;">📍 {}</span>',
            loc
        )


