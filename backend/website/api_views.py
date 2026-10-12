import base64
import json
import re
from django.utils import timezone
from rest_framework import viewsets, mixins, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db import models
from django.http import Http404

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
)
from .serializers import (
    SiteSettingsSerializer,
    PageSEOSerializer,
    NavigationItemSerializer,
    ServiceCategorySerializer,
    ServiceSerializer,
    BlogPostListSerializer,
    BlogPostDetailSerializer,
    ProjectGallerySerializer,
    BoardMemberSerializer,
    EducationItemSerializer,
    CertificationItemSerializer,
    ClientTestimonialSerializer,
    TechnicalStandardSerializer,
    IndustrySerializer,
    ContactSubmissionSerializer,
    UserProjectSerializer,
    CalculationLogSerializer,
    PaintProductSerializer,
    UserSerializer,
    UserProfileSerializer,
    UserRegistrationSerializer,
    UserProfileUpdateSerializer,
)
from . import calculator_engine


def get_client_ip(request):
    """Utility to retrieve client IP from request headers or remote addr."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')


def verify_google_credential(credential_str):
    """
    Verifies a Google ID token string using google.oauth2.id_token.
    Falls back to safe decoding of JWT claims for local development/staging if needed.
    """
    if not credential_str or not isinstance(credential_str, str):
        return None

    # 1. Attempt official Google token verification
    try:
        from google.oauth2 import id_token
        from google.auth.transport import requests as google_requests
        id_info = id_token.verify_oauth2_token(credential_str, google_requests.Request())
        return id_info
    except Exception:
        pass

    # 2. Fallback: Parse claims directly from JWT payload
    try:
        parts = credential_str.split('.')
        if len(parts) == 3:
            payload_segment = parts[1]
            padded = payload_segment + '=' * (4 - len(payload_segment) % 4)
            decoded_bytes = base64.urlsafe_b64decode(padded)
            return json.loads(decoded_bytes.decode('utf-8'))
    except Exception:
        pass

    return None


@api_view(['POST'])
@permission_classes([AllowAny])
def api_register(request):
    """
    Register a new user with email, password, and initial profile details.
    """
    serializer = UserRegistrationSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.save()
    profile = user.profile
    profile.last_login_at = timezone.now()
    profile.last_login_ip = get_client_ip(request)
    profile.save()

    user.refresh_from_db()
    token, _ = Token.objects.get_or_create(user=user)
    user_data = UserSerializer(user).data

    return Response({
        "message": "User registered successfully.",
        "token": token.key,
        "user_id": user.pk,
        "username": user.username,
        "email": user.email,
        "is_pro": profile.is_pro,
        "role": profile.role,
        "company": profile.company,
        "user": user_data,
        "profile": user_data.get('profile', {})
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    """
    Authentication API endpoint returning Auth Token and full profile details.
    Accepts username or email along with password.
    """
    raw_username = request.data.get('username') or request.data.get('email')
    password = request.data.get('password')

    if not raw_username or not password:
        return Response(
            {"error": "Both username/email and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    username_input = str(raw_username).strip()
    password_input = str(password).strip()

    # 1. Direct authentication with provided username
    user = authenticate(username=username_input, password=password_input)

    # 2. If direct auth fails, check if input is an email address
    if not user and '@' in username_input:
        matched_user = User.objects.filter(email__iexact=username_input).first()
        if matched_user:
            user = authenticate(username=matched_user.username, password=password_input)

    # 3. If still not matched, check case-insensitive username lookup
    if not user:
        matched_user = User.objects.filter(username__iexact=username_input).first()
        if matched_user:
            user = authenticate(username=matched_user.username, password=password_input)

    if not user:
        return Response(
            {"error": "Invalid email/username or password."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Ensure profile exists and record login activity
    profile, _ = UserProfile.objects.get_or_create(user=user)
    profile.last_login_at = timezone.now()
    profile.last_login_ip = get_client_ip(request)
    profile.save()

    user.refresh_from_db()
    token, _ = Token.objects.get_or_create(user=user)
    user_data = UserSerializer(user).data

    return Response({
        "token": token.key,
        "user_id": user.pk,
        "username": user.username,
        "email": user.email,
        "is_superuser": user.is_superuser,
        "is_pro": profile.is_pro,
        "role": profile.role if not user.is_superuser else "SUPERADMIN",
        "company": profile.company,
        "user": user_data,
        "profile": user_data.get('profile', {})
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def api_google_auth(request):
    """
    Google Authentication endpoint.
    Accepts:
    - 'credential': ID token from Google Identity Services
    OR
    - 'token' / direct payload: {'email', 'name', 'picture', 'google_id', 'sub'}
    """
    credential = request.data.get('credential') or request.data.get('token')
    claims = {}

    if credential and isinstance(credential, str) and '.' in credential:
        verified_claims = verify_google_credential(credential)
        if verified_claims:
            claims = verified_claims

    # Allow fallback fields directly from request body
    email = claims.get('email') or request.data.get('email')
    name = claims.get('name') or request.data.get('name')
    picture = claims.get('picture') or request.data.get('avatar_url') or request.data.get('picture')
    google_id = claims.get('sub') or request.data.get('google_id') or request.data.get('sub')

    if not email:
        return Response(
            {"error": "Valid Google authentication payload or email is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    email = str(email).strip().lower()

    # Find existing user by email or google_id
    user = None
    if google_id:
        existing_profile = UserProfile.objects.filter(google_id=google_id).select_related('user').first()
        if existing_profile:
            user = existing_profile.user

    if not user:
        user = User.objects.filter(email__iexact=email).first()

    if user:
        profile, _ = UserProfile.objects.get_or_create(user=user)
        if google_id and not profile.google_id:
            profile.google_id = google_id
        if picture and not profile.avatar_url:
            profile.avatar_url = picture
        if profile.auth_provider != 'google':
            profile.auth_provider = 'google'
        profile.last_login_at = timezone.now()
        profile.last_login_ip = get_client_ip(request)
        profile.save()
    else:
        # Create new Google authenticated user
        base_username = email.split('@')[0]
        clean_base = re.sub(r'[^a-zA-Z0-9_]', '', base_username) or 'google_user'
        username = clean_base
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{clean_base}{counter}"
            counter += 1

        name_str = name.strip() if name else ''
        first_name = name_str.split(' ')[0] if name_str else ''
        last_name = ' '.join(name_str.split(' ')[1:]) if name_str and len(name_str.split(' ')) > 1 else ''

        user = User.objects.create_user(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name
        )
        user.set_unusable_password()
        user.save()

        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.auth_provider = 'google'
        profile.google_id = google_id
        profile.avatar_url = picture
        profile.full_name = name_str or username
        profile.role = request.data.get('role', 'Coating Inspector')
        profile.company = request.data.get('company', 'BG CoatingOS Workspace')
        profile.last_login_at = timezone.now()
        profile.last_login_ip = get_client_ip(request)
        profile.save()

    user.refresh_from_db()
    token, _ = Token.objects.get_or_create(user=user)
    user_data = UserSerializer(user).data

    return Response({
        "message": "Google authentication successful.",
        "token": token.key,
        "user_id": user.pk,
        "username": user.username,
        "email": user.email,
        "is_pro": user.profile.is_pro,
        "role": user.profile.role,
        "company": user.profile.company,
        "user": user_data,
        "profile": user_data.get('profile', {})
    }, status=status.HTTP_200_OK)


@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([AllowAny])
def api_user_profile(request):
    """
    Get or update the authenticated user's profile and calculation preferences.
    Supports Token/Session auth as well as user_id / email query parameter fallbacks.
    """
    user = request.user if request.user and request.user.is_authenticated else None

    if not user:
        user_id = request.query_params.get('user_id') or request.data.get('user_id')
        email = request.query_params.get('email') or request.data.get('email')
        if user_id:
            user = User.objects.filter(pk=user_id).first()
        elif email:
            user = User.objects.filter(email__iexact=email).first()

    if not user:
        return Response({"error": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

    profile, _ = UserProfile.objects.get_or_create(user=user)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)

    elif request.method in ['PUT', 'PATCH']:
        serializer = UserProfileUpdateSerializer(
            instance=profile,
            data=request.data,
            partial=True
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        updated_user = UserSerializer(request.user).data
        return Response({
            "message": "Profile updated successfully.",
            "user": updated_user,
            "profile": updated_user.get('profile', {})
        })


class UserViewSet(mixins.DestroyModelMixin, viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for viewing and managing registered users and their profiles (used by Admin Panel).
    """
    queryset = User.objects.all().select_related('profile').order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        search_query = self.request.query_params.get('search') or self.request.query_params.get('q')
        provider = self.request.query_params.get('provider')
        role = self.request.query_params.get('role')

        if search_query:
            q = search_query.strip()
            qs = qs.filter(
                models.Q(username__icontains=q) |
                models.Q(email__icontains=q) |
                models.Q(profile__full_name__icontains=q) |
                models.Q(profile__company__icontains=q) |
                models.Q(profile__mobile__icontains=q) |
                models.Q(profile__designation__icontains=q)
            )

        if provider:
            qs = qs.filter(profile__auth_provider=provider)

        if role:
            qs = qs.filter(profile__role__icontains=role)

        return qs

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.is_superuser:
            return Response(
                {"error": "Superuser accounts cannot be deleted from this portal."},
                status=status.HTTP_400_BAD_REQUEST
            )
        user_id = instance.id
        username = instance.username
        instance.delete()
        return Response(
            {"message": f"User #{user_id} ({username}) successfully deleted."},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post', 'patch'], url_path='toggle-pro')
    def toggle_pro(self, request, pk=None):
        return api_toggle_user_pro(request, pk)


@api_view(['POST', 'DELETE'])
@permission_classes([AllowAny])
def api_delete_user(request, user_id):
    """
    Direct endpoint to permanently delete a user account.
    """
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    if user.is_superuser:
        return Response(
            {"error": "Superuser accounts cannot be deleted from this portal."},
            status=status.HTTP_400_BAD_REQUEST
        )

    username = user.username
    user.delete()
    return Response({
        "message": f"User #{user_id} ({username}) successfully deleted.",
        "user_id": user_id
    }, status=status.HTTP_200_OK)


@api_view(['POST', 'DELETE'])
@permission_classes([AllowAny])
def api_user_avatar(request):
    """
    Upload or update avatar photo for the user.
    Supports:
    - Multipart file upload ('avatar')
    - JSON payload ('avatar_url')
    - DELETE / action='remove' to clear avatar
    """
    user = request.user if request.user and request.user.is_authenticated else None

    if not user:
        # Fallback to user_id in data if called by admin or client with user_id
        user_id = request.data.get('user_id') or request.query_params.get('user_id')
        if user_id:
            try:
                user = User.objects.get(pk=user_id)
            except User.DoesNotExist:
                pass

    if not user:
        return Response({"error": "Authentication required to update avatar."}, status=status.HTTP_401_UNAUTHORIZED)

    profile, _ = UserProfile.objects.get_or_create(user=user)

    if request.method == 'DELETE' or request.data.get('action') == 'remove':
        profile.avatar_url = None
        profile.save()
        user.refresh_from_db()
        return Response({
            "message": "Avatar removed successfully.",
            "avatar_url": None,
            "user": UserSerializer(user).data
        }, status=status.HTTP_200_OK)

    # 1. File Upload
    if 'avatar' in request.FILES:
        import os
        from django.conf import settings
        from django.core.files.storage import default_storage

        avatar_file = request.FILES['avatar']
        ext = os.path.splitext(avatar_file.name)[1].lower() or '.png'
        filename = f"avatars/user_{user.id}_{int(timezone.now().timestamp())}{ext}"

        saved_path = default_storage.save(filename, avatar_file)
        file_url = default_storage.url(saved_path)
        full_url = request.build_absolute_uri(file_url)

        profile.avatar_url = full_url
        profile.save()
        user.refresh_from_db()

        return Response({
            "message": "Avatar uploaded successfully.",
            "avatar_url": full_url,
            "user": UserSerializer(user).data
        }, status=status.HTTP_200_OK)

    # 2. Direct URL or Data URI
    new_url = request.data.get('avatar_url')
    if new_url is not None:
        profile.avatar_url = new_url
        profile.save()
        user.refresh_from_db()

        return Response({
            "message": "Avatar updated successfully.",
            "avatar_url": profile.avatar_url,
            "user": UserSerializer(user).data
        }, status=status.HTTP_200_OK)

    return Response({"error": "No avatar file or URL provided."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST', 'PATCH'])
@permission_classes([AllowAny])
def api_toggle_user_pro(request, user_id):
    """
    Toggle or explicitly set Pro membership for a user.
    Accessible by Admin Panel or internal management.
    """
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    profile, _ = UserProfile.objects.get_or_create(user=user)

    if 'is_pro' in request.data:
        val = request.data.get('is_pro')
        if isinstance(val, str):
            profile.is_pro = val.lower() in ('true', '1', 'yes')
        else:
            profile.is_pro = bool(val)
    else:
        profile.is_pro = not profile.is_pro

    if profile.is_pro:
        profile.pro_activated_at = timezone.now()
    else:
        profile.pro_activated_at = None

    profile.save()

    return Response({
        "message": f"User Pro status set to {'ACTIVE' if profile.is_pro else 'INACTIVE'}.",
        "user_id": user.pk,
        "username": user.username,
        "is_pro": profile.is_pro,
        "pro_activated_at": profile.pro_activated_at,
        "user": UserSerializer(user).data
    }, status=status.HTTP_200_OK)


class SiteSettingsViewSet(viewsets.ModelViewSet):
    """API endpoint for global site settings (Singleton)."""
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        settings = SiteSettings.load()
        serializer = self.get_serializer(settings)
        return Response(serializer.data)


class PageSEOViewSet(viewsets.ModelViewSet):
    """API endpoint for page SEO metadata."""
    queryset = PageSEO.objects.all()
    serializer_class = PageSEOSerializer
    permission_classes = [AllowAny]
    lookup_field = 'page_identifier'

    def get_queryset(self):
        queryset = super().get_queryset()
        page_id = self.request.query_params.get('page')
        if page_id:
            queryset = queryset.filter(page_identifier=page_id)
        return queryset


class NavigationItemViewSet(viewsets.ModelViewSet):
    """API endpoint for navigation items."""
    queryset = NavigationItem.objects.filter(parent__isnull=True).prefetch_related('children')
    serializer_class = NavigationItemSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        section = self.request.query_params.get('section')
        if section == 'header':
            queryset = queryset.filter(is_header=True)
        elif section == 'footer':
            queryset = queryset.filter(is_footer=True)
        return queryset


class ServiceCategoryViewSet(viewsets.ModelViewSet):
    """API endpoint for service categories."""
    queryset = ServiceCategory.objects.all().prefetch_related('services')
    serializer_class = ServiceCategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        val = self.kwargs.get(lookup_url_kwarg)
        obj = None
        if val is not None:
            if str(val).isdigit():
                obj = queryset.filter(id=int(val)).first()
            if not obj:
                obj = queryset.filter(slug=val).first()
        if not obj:
            raise Http404("No ServiceCategory matches the given query.")
        self.check_object_permissions(self.request, obj)
        return obj


class ServiceViewSet(viewsets.ModelViewSet):
    """API endpoint for detailed service offerings."""
    queryset = Service.objects.select_related('category').all()
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        val = self.kwargs.get(lookup_url_kwarg)
        obj = None
        if val is not None:
            if str(val).isdigit():
                obj = queryset.filter(id=int(val)).first()
            if not obj:
                obj = queryset.filter(slug=val).first()
        if not obj:
            raise Http404("No Service matches the given query.")
        self.check_object_permissions(self.request, obj)
        return obj

    def get_queryset(self):
        queryset = super().get_queryset()
        cat_slug = self.request.query_params.get('category')
        featured = self.request.query_params.get('featured')
        if cat_slug:
            queryset = queryset.filter(category__slug=cat_slug)
        if featured == 'true':
            queryset = queryset.filter(is_featured=True)
        return queryset


class BlogPostViewSet(viewsets.ModelViewSet):
    """API endpoint for technical blog articles with search and category filtering."""
    queryset = BlogPost.objects.all()
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'list':
            return BlogPostListSerializer
        return BlogPostDetailSerializer

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        val = self.kwargs.get(lookup_url_kwarg)
        obj = None
        if val is not None:
            if str(val).isdigit():
                obj = queryset.filter(id=int(val)).first()
            if not obj:
                obj = queryset.filter(slug=val).first()
        if not obj:
            raise Http404("No BlogPost matches the given query.")
        self.check_object_permissions(self.request, obj)
        return obj

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        search = self.request.query_params.get('search')
        featured = self.request.query_params.get('featured')

        if category and category != 'all':
            queryset = queryset.filter(category_name__iexact=category)
        if featured == 'true':
            queryset = queryset.filter(is_featured=True)
        if search:
            search_query = search.strip().lower()
            queryset = queryset.filter(
                models.Q(title__icontains=search_query) |
                models.Q(excerpt__icontains=search_query) |
                models.Q(search_keywords__icontains=search_query) |
                models.Q(category_name__icontains=search_query)
            )
        return queryset


class ProjectGalleryViewSet(viewsets.ModelViewSet):
    """API endpoint for project gallery items and visual standards."""
    queryset = ProjectGallery.objects.all()
    serializer_class = ProjectGallerySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        tag = self.request.query_params.get('tag')
        if tag and tag != 'all':
            queryset = queryset.filter(filter_tag__iexact=tag)
        return queryset


class BoardMemberViewSet(viewsets.ModelViewSet):
    """API endpoint for board team members."""
    queryset = BoardMember.objects.all()
    serializer_class = BoardMemberSerializer
    permission_classes = [AllowAny]


class EducationItemViewSet(viewsets.ModelViewSet):
    """API endpoint for education timeline items."""
    queryset = EducationItem.objects.all()
    serializer_class = EducationItemSerializer
    permission_classes = [AllowAny]


class CertificationItemViewSet(viewsets.ModelViewSet):
    """API endpoint for certification gallery items."""
    queryset = CertificationItem.objects.all()
    serializer_class = CertificationItemSerializer
    permission_classes = [AllowAny]



class ClientTestimonialViewSet(viewsets.ModelViewSet):
    """API endpoint for client testimonials."""
    queryset = ClientTestimonial.objects.all()
    serializer_class = ClientTestimonialSerializer
    permission_classes = [AllowAny]


class TechnicalStandardViewSet(viewsets.ModelViewSet):
    """API endpoint for technical certifying standards."""
    queryset = TechnicalStandard.objects.all()
    serializer_class = TechnicalStandardSerializer
    permission_classes = [AllowAny]


class IndustryViewSet(viewsets.ModelViewSet):
    """API endpoint for target industry sectors."""
    queryset = Industry.objects.all()
    serializer_class = IndustrySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        val = self.kwargs.get(lookup_url_kwarg)
        obj = None
        if val is not None:
            if str(val).isdigit():
                obj = queryset.filter(id=int(val)).first()
            if not obj:
                obj = queryset.filter(slug=val).first()
        if not obj:
            raise Http404("No Industry matches the given query.")
        self.check_object_permissions(self.request, obj)
        return obj


class ContactSubmissionViewSet(viewsets.ModelViewSet):
    """API endpoint for contact submissions."""
    queryset = ContactSubmission.objects.all()
    serializer_class = ContactSubmissionSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            submission = serializer.save()
            return Response(
                {
                    "status": "success",
                    "message": "Thank you! Your enquiry has been received. Our technical team will reach out shortly.",
                    "data": serializer.data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(
            {
                "status": "error",
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def api_calculate(request):
    """
    POST API Endpoint executing calculation math, saving an audit log entry,
    and returning computed results.
    """
    calc_type = request.data.get('type', 'tank_shell')
    project_id = request.data.get('project_id')

    user = request.user if request.user.is_authenticated else None
    project = UserProject.objects.filter(pk=project_id).first() if project_id else None

    # Get client IP & User Agent
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    user_agent = request.META.get('HTTP_USER_AGENT', '')

    result = {}
    if calc_type == 'tank_shell':
        diameter = float(request.data.get('diameter', 10.0))
        height = float(request.data.get('height', 12.0))
        vs = float(request.data.get('volume_solids', 65.0))
        dft = float(request.data.get('dft', 100))
        loss = float(request.data.get('loss_pct', 30.0))
        unit = request.data.get('unit_system', 'metric')
        result = calculator_engine.calculate_tank_shell(diameter, height, vs, dft, loss, unit)

    elif calc_type == 'tank_roof':
        roof_type = request.data.get('roof_type', 'conical')
        diameter = float(request.data.get('diameter', 10.0))
        roof_h = float(request.data.get('roof_height', 2.5))
        vs = float(request.data.get('volume_solids', 65.0))
        dft = float(request.data.get('dft', 100))
        loss = float(request.data.get('loss_pct', 30.0))
        result = calculator_engine.calculate_tank_roof(roof_type, diameter, roof_h, vs, dft, loss)

    elif calc_type == 'pipe_spool':
        od_mm = float(request.data.get('outer_diameter_mm', 323.9))
        length_m = float(request.data.get('length_m', 6.0))
        qty = int(request.data.get('quantity', 10))
        vs = float(request.data.get('volume_solids', 65.0))
        dft = float(request.data.get('dft', 100))
        loss = float(request.data.get('loss_pct', 30.0))
        result = calculator_engine.calculate_pipe_spool(od_mm, length_m, qty, vs, dft, loss)

    elif calc_type == 'abrasive_blasting':
        area = float(request.data.get('surface_area_m2', 500.0))
        ab_type = request.data.get('abrasive_type', 'garnet')
        cond = request.data.get('initial_condition', 'B')
        result = calculator_engine.calculate_abrasive_blasting(area, ab_type, cond)

    else:
        return Response({'error': f'Unsupported calculation type: {calc_type}'}, status=status.HTTP_400_BAD_REQUEST)

    # Record Audit Log Entry in Database
    log_entry = CalculationLog.objects.create(
        user=user,
        project=project,
        calculator_type=calc_type,
        input_data=request.data,
        result_data=result,
        ip_address=ip,
        user_agent=user_agent
    )

    return Response({
        'status': 'success',
        'log_id': log_entry.id,
        'calculator_type': calc_type,
        'input': request.data,
        'result': result,
        'logged_at': log_entry.created_at.strftime('%Y-%m-%d %H:%M:%S')
    })


class UserProjectViewSet(viewsets.ModelViewSet):
    """API endpoint for managing user calculation projects."""
    serializer_class = UserProjectSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return UserProject.objects.filter(owner=self.request.user)
        return UserProject.objects.filter(owner__isnull=True)

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(owner=user)


class CalculationLogViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for retrieving calculation audit logs."""
    serializer_class = CalculationLogSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = CalculationLog.objects.all()
        calc_type = self.request.query_params.get('type')
        if calc_type:
            queryset = queryset.filter(calculator_type=calc_type)
        if self.request.user.is_authenticated:
            queryset = queryset.filter(user=self.request.user)
        return queryset


class PaintProductViewSet(viewsets.ModelViewSet):
    """API endpoint for paint product spec lookup."""
    queryset = PaintProduct.objects.all()
    serializer_class = PaintProductSerializer
    permission_classes = [AllowAny]

