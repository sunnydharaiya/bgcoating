from rest_framework import serializers
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
    UserProject,
    CalculationLog,
    PaintProduct,
)


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = '__all__'


class PageSEOSerializer(serializers.ModelSerializer):
    page_identifier_display = serializers.CharField(source='get_page_identifier_display', read_only=True)

    class Meta:
        model = PageSEO
        fields = '__all__'


class RecursiveNavigationItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = NavigationItem
        fields = ['id', 'title', 'url', 'order', 'is_header', 'is_footer', 'is_external']


class NavigationItemSerializer(serializers.ModelSerializer):
    children = RecursiveNavigationItemSerializer(many=True, read_only=True)

    class Meta:
        model = NavigationItem
        fields = ['id', 'title', 'url', 'order', 'is_header', 'is_footer', 'is_external', 'parent', 'children']


class ServiceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)

    class Meta:
        model = Service
        fields = [
            'id', 'title', 'slug', 'category', 'category_name', 'category_slug',
            'excerpt', 'description', 'cover_image', 'full_content', 'standard_code',
            'icon_svg', 'is_featured', 'order'
        ]


class ServiceCategorySerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)

    class Meta:
        model = ServiceCategory
        fields = ['id', 'name', 'slug', 'description', 'order', 'services']


class BlogPostListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for blog listing & previews."""
    formatted_date = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'category_name', 'publish_date', 'formatted_date',
            'read_time_minutes', 'excerpt', 'featured_image', 'search_keywords',
            'external_url', 'is_featured'
        ]

    def get_formatted_date(self, obj):
        return obj.publish_date.strftime('%d %b %Y').upper() if obj.publish_date else ''


class BlogPostDetailSerializer(serializers.ModelSerializer):
    """Full detail serializer for blog posts."""
    formatted_date = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = '__all__'

    def get_formatted_date(self, obj):
        return obj.publish_date.strftime('%d %b %Y').upper() if obj.publish_date else ''


class ProjectGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectGallery
        fields = '__all__'


class BoardMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoardMember
        fields = '__all__'


class EducationItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationItem
        fields = '__all__'


class CertificationItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CertificationItem
        fields = '__all__'



class ClientTestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientTestimonial
        fields = '__all__'


class TechnicalStandardSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechnicalStandard
        fields = '__all__'


class IndustrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Industry
        fields = '__all__'


class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ['id', 'full_name', 'company', 'email', 'phone', 'service_of_interest', 'message', 'submitted_at']
        read_only_fields = ['id', 'submitted_at']

    def validate_full_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Full name is required.")
        return value.strip()

    def validate_phone(self, value):
        if not value.strip():
            raise serializers.ValidationError("Phone number is required.")
        return value.strip()

    def validate_message(self, value):
        if not value.strip():
            raise serializers.ValidationError("Message content is required.")
        return value.strip()


class UserProjectSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model = UserProject
        fields = ['id', 'title', 'client_name', 'facility_location', 'owner', 'owner_username', 'created_at', 'updated_at']
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']


class CalculationLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    calculator_type_display = serializers.CharField(source='get_calculator_type_display', read_only=True)

    class Meta:
        model = CalculationLog
        fields = [
            'id', 'user', 'username', 'project', 'calculator_type', 'calculator_type_display',
            'input_data', 'result_data', 'ip_address', 'user_agent', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'ip_address', 'user_agent', 'created_at']


class PaintProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaintProduct
        fields = '__all__'

