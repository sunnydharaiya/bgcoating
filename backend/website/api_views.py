from rest_framework import viewsets, mixins, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.db import models

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
)
from . import calculator_engine


@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    """Authentication API endpoint returning Auth Token and user details."""
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {"error": "Both username and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=username, password=password)
    if not user:
        return Response(
            {"error": "Invalid username or password."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        "token": token.key,
        "user_id": user.pk,
        "username": user.username,
        "email": user.email,
        "is_superuser": user.is_superuser,
        "role": "SUPERADMIN" if user.is_superuser else "ADMIN"
    })


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


class ServiceViewSet(viewsets.ModelViewSet):
    """API endpoint for detailed service offerings."""
    queryset = Service.objects.select_related('category').all()
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

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

