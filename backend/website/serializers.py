from django.contrib.auth.models import User
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
    UserProfile,
    VisitorCount,
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


class FlexibleImageField(serializers.ImageField):
    """
    An ImageField that gracefully handles both binary uploads and existing URL/path strings.
    If a string URL or path matching the existing image is sent, it preserves the existing file.
    """
    def to_internal_value(self, data):
        if isinstance(data, str):
            if not data.strip():
                if self.allow_null or not self.required:
                    return None
            inst = getattr(self.parent, 'instance', None)
            if inst:
                current_file = getattr(inst, self.source or self.field_name, None)
                if current_file:
                    return current_file
            if data.startswith('assets/') or '/media/' in data or data.startswith('/'):
                return data
            if self.allow_null or not self.required:
                return None
        return super().to_internal_value(data)


class ServiceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    cover_image = FlexibleImageField(required=False, allow_null=True)
    thumbnail_image = FlexibleImageField(required=False, allow_null=True)
    thumbnail_url = serializers.CharField(read_only=True)

    class Meta:
        model = Service
        fields = [
            'id', 'title', 'slug', 'category', 'category_name', 'category_slug',
            'excerpt', 'description', 'cover_image', 'thumbnail_image', 'thumbnail_url',
            'full_content', 'standard_code', 'icon_svg', 'is_featured', 'order'
        ]


class ServiceCategorySerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)

    class Meta:
        model = ServiceCategory
        fields = ['id', 'name', 'slug', 'description', 'order', 'services']


class BlogPostListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for blog listing & previews."""
    formatted_date = serializers.SerializerMethodField()
    featured_image = FlexibleImageField(required=False, allow_null=True)

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'category_name', 'publish_date', 'formatted_date',
            'read_time_minutes', 'excerpt', 'content', 'featured_image', 'search_keywords',
            'external_url', 'is_featured'
        ]

    def get_formatted_date(self, obj):
        return obj.publish_date.strftime('%d %b %Y').upper() if obj.publish_date else ''


class BlogPostDetailSerializer(serializers.ModelSerializer):
    """Full detail serializer for blog posts."""
    formatted_date = serializers.SerializerMethodField()
    featured_image = FlexibleImageField(required=False, allow_null=True)

    class Meta:
        model = BlogPost
        fields = '__all__'

    def get_formatted_date(self, obj):
        return obj.publish_date.strftime('%d %b %Y').upper() if obj.publish_date else ''


class ProjectGallerySerializer(serializers.ModelSerializer):
    image = FlexibleImageField(required=False, allow_null=True)
    standard = serializers.CharField(required=False, allow_blank=True, default='')

    class Meta:
        model = ProjectGallery
        fields = '__all__'

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        if 'standard_code' in data and not data.get('standard'):
            data['standard'] = data.get('standard_code')
        if not data.get('summary') and data.get('title'):
            data['summary'] = data.get('title')
        return super().to_internal_value(data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['standard_code'] = instance.standard
        return ret


class BoardMemberSerializer(serializers.ModelSerializer):
    image = FlexibleImageField(required=False, allow_null=True)

    class Meta:
        model = BoardMember
        fields = '__all__'


class EducationItemSerializer(serializers.ModelSerializer):
    certificate_image = FlexibleImageField(required=False, allow_null=True)

    class Meta:
        model = EducationItem
        fields = '__all__'


class CertificationItemSerializer(serializers.ModelSerializer):
    certificate_image = FlexibleImageField(required=False, allow_null=True)

    class Meta:
        model = CertificationItem
        fields = '__all__'



class ClientTestimonialSerializer(serializers.ModelSerializer):
    client_photo = FlexibleImageField(required=False, allow_null=True)

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


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()
    is_pro = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'full_name', 'is_pro', 'is_superuser', 'is_staff', 'date_joined',
            'last_login', 'profile'
        ]

    def get_full_name(self, obj):
        if hasattr(obj, 'profile') and obj.profile.full_name:
            return obj.profile.full_name
        name = f"{obj.first_name} {obj.last_name}".strip()
        return name or obj.username

    def get_is_pro(self, obj):
        if hasattr(obj, 'profile'):
            return bool(obj.profile.is_pro)
        return False


class UserRegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    role = serializers.CharField(max_length=100, required=False, allow_blank=True, default='Coating Inspector')
    company = serializers.CharField(max_length=255, required=False, allow_blank=True, default='BG Coating & Inspection Services')

    def validate_email(self, value):
        normalized = value.strip().lower()
        if User.objects.filter(email__iexact=normalized).exists():
            raise serializers.ValidationError("An account with this email address already exists.")
        return normalized

    def create(self, validated_data):
        import re
        email = validated_data['email']
        password = validated_data['password']
        name = validated_data.get('name', '').strip()
        role = validated_data.get('role', 'Coating Inspector')
        company = validated_data.get('company', 'BG Coating & Inspection Services')

        base_username = email.split('@')[0]
        clean_base = re.sub(r'[^a-zA-Z0-9_]', '', base_username) or 'user'
        username = clean_base
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{clean_base}{counter}"
            counter += 1

        first_name = name.split(' ')[0] if name else ''
        last_name = ' '.join(name.split(' ')[1:]) if name and len(name.split(' ')) > 1 else ''

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.full_name = name or username
        profile.auth_provider = 'email'
        profile.role = role
        profile.company = company
        profile.save()

        return user


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='full_name', required=False)
    email = serializers.EmailField(required=False)

    class Meta:
        model = UserProfile
        fields = [
            'name',
            'full_name',
            'email',
            'mobile',
            'country_code',
            'designation',
            'department',
            'emp_id',
            'role',
            'company',
            'bu',
            'office_location',
            'branch',
            'website',
            'alt_mobile',
            'alt_email',
            'address',
            'city',
            'state',
            'country',
            'zip_code',
            'experience_years',
            'discipline',
            'expertise',
            'certifications',
            'preferred_standards',
            'default_dashboard',
            'unit_system',
            'language',
            'theme',
            'time_zone',
            'date_format',
            'avatar_url',
        ]

    def update(self, instance, validated_data):
        email = validated_data.pop('email', None)
        if email and email != instance.user.email:
            if User.objects.filter(email__iexact=email).exclude(pk=instance.user.pk).exists():
                raise serializers.ValidationError({"email": "This email is already in use by another account."})
            instance.user.email = email
            instance.user.save(update_fields=['email'])

        name = validated_data.get('full_name')
        if name:
            parts = name.strip().split(' ', 1)
            instance.user.first_name = parts[0]
            instance.user.last_name = parts[1] if len(parts) > 1 else ''
            instance.user.save(update_fields=['first_name', 'last_name'])

        return super().update(instance, validated_data)


class VisitorCountSerializer(serializers.ModelSerializer):
    duration_display = serializers.CharField(read_only=True)
    location_display = serializers.CharField(read_only=True)
    short_visitor_hash = serializers.CharField(read_only=True)
    short_visit_hash = serializers.CharField(read_only=True)

    class Meta:
        model = VisitorCount
        fields = [
            'id',
            'visitor_hash',
            'visit_hash',
            'short_visitor_hash',
            'short_visit_hash',
            'ip_address',
            'session_key',
            'page_url',
            'page_title',
            'referer',
            'country',
            'country_code',
            'city',
            'region',
            'location_display',
            'user_agent',
            'device_type',
            'browser',
            'os_name',
            'duration_seconds',
            'duration_display',
            'visited_at',
            'updated_at',
        ]
        read_only_fields = fields

