from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from . import views
from . import api_views

router = DefaultRouter()
router.register('site-settings', api_views.SiteSettingsViewSet, basename='sitesettings')
router.register('seo-metadata', api_views.PageSEOViewSet, basename='pageseo')
router.register('navigation', api_views.NavigationItemViewSet, basename='navigationitem')
router.register('service-categories', api_views.ServiceCategoryViewSet, basename='servicecategory')
router.register('services', api_views.ServiceViewSet, basename='service')
router.register('blog-posts', api_views.BlogPostViewSet, basename='blogpost')
router.register('gallery', api_views.ProjectGalleryViewSet, basename='projectgallery')
router.register('board-members', api_views.BoardMemberViewSet, basename='boardmember')
router.register('education', api_views.EducationItemViewSet, basename='educationitem')
router.register('certifications', api_views.CertificationItemViewSet, basename='certificationitem')
router.register('testimonials', api_views.ClientTestimonialViewSet, basename='clienttestimonial')
router.register('standards', api_views.TechnicalStandardViewSet, basename='technicalstandard')
router.register('industries', api_views.IndustryViewSet, basename='industry')
router.register('contact-submissions', api_views.ContactSubmissionViewSet, basename='contactsubmission')
router.register('calculator/projects', api_views.UserProjectViewSet, basename='userproject')
router.register('calculator/logs', api_views.CalculationLogViewSet, basename='calculationlog')
router.register('calculator/products', api_views.PaintProductViewSet, basename='paintproduct')
router.register('users', api_views.UserViewSet, basename='user')
router.register('visitor-logs', api_views.VisitorCountViewSet, basename='visitorcount')

urlpatterns = [
    path('api/v1/visitors/duration/', api_views.api_update_visitor_duration, name='api_update_visitor_duration'),
    path('api/v1/auth/register/', api_views.api_register, name='api_register'),
    path('api/v1/auth/login/', api_views.api_login, name='api_login'),
    path('api/v1/auth/google/', api_views.api_google_auth, name='api_google_auth'),
    path('api/v1/auth/profile/', api_views.api_user_profile, name='api_user_profile'),
    path('api/v1/auth/profile/avatar/', api_views.api_user_avatar, name='api_user_avatar'),
    path('api/v1/users/<int:user_id>/toggle-pro/', api_views.api_toggle_user_pro, name='api_toggle_user_pro'),
    path('api/v1/users/<int:user_id>/delete/', api_views.api_delete_user, name='api_delete_user'),
    path('api/v1/calculator/calculate/', api_views.api_calculate, name='api_calculate'),
    path('api/v1/', include(router.urls)),
    path('', views.home, name='home'),
    path('index.html', views.home, name='home_html'),
    path('index.php', views.home, name='home_php'),
    path('about/', views.about, name='about'),
    path('about.php', views.about, name='about_php'),
    path('services/', views.services, name='services'),
    path('services.php', views.services, name='services_php'),
    path('services/<slug:slug>/', views.service_detail, name='service_detail'),
    path('blog/', views.blog, name='blog'),
    path('blog.php', views.blog, name='blog_php'),
    path('blog/<slug:slug>/', views.blog_detail, name='blog_detail'),
    path('gallery/', views.gallery, name='gallery'),
    path('gallery.php', views.gallery, name='gallery_php'),
    path('contact/', views.contact, name='contact'),
    path('contact.php', views.contact, name='contact_php'),
    path('thank-you/', views.thank_you, name='thank_you'),
    path('thankyou/', views.thank_you, name='thankyou'),
    path('thank-you.html', views.thank_you, name='thank_you_html'),
    path('thankyou.html', views.thank_you, name='thankyou_html'),
    path('thank-you.php', views.thank_you, name='thank_you_php'),
    path('thankyou.php', views.thank_you, name='thankyou_php'),
    path('board/', views.board, name='board'),
    path('board.php', views.board, name='board_php'),
    path('calculator/', views.calculator_dashboard, name='calculator'),
    path('calculator.html', views.calculator_dashboard, name='calculator_html'),
    path('calculator/dashboard/', views.calculator_dashboard, name='calculator_dashboard'),
    path('calculator/dashboard.html', views.calculator_dashboard, name='calculator_dashboard_html'),
    path('calculator/coating-calculator/', views.calculator_suite, name='calculator_suite'),
    path('calculator/coating-calculator.html', views.calculator_suite, name='calculator_suite_html'),
    path('calculator/specification-reading/', views.calculator_specification_reading, name='calculator_spec_reading'),
    path('calculator/specification-reading.html', views.calculator_specification_reading, name='calculator_spec_reading_html'),
    path('calculator/coating-procedure/', views.calculator_procedure, name='calculator_procedure'),
    path('calculator/coating-procedure.html', views.calculator_procedure, name='calculator_procedure_html'),
    path('calculator/unit-rate-estimation/', views.calculator_unit_rate_estimation, name='calculator_unit_rate_estimation'),
    path('calculator/unit-rate-estimation.html', views.calculator_unit_rate_estimation, name='calculator_unit_rate_estimation_html'),
    path('calculator/manpower-estimation/', views.calculator_manpower_estimation, name='calculator_manpower_estimation'),
    path('calculator/manpower-estimation.html', views.calculator_manpower_estimation, name='calculator_manpower_estimation_html'),
    path('calculator/blaster-qualification/', views.calculator_blaster_qualification, name='calculator_blaster_qualification'),
    path('calculator/blaster-qualification.html', views.calculator_blaster_qualification, name='calculator_blaster_qualification_html'),
    path('calculator/painter-qualification/', views.calculator_painter_qualification, name='calculator_painter_qualification'),
    path('calculator/painter-qualification.html', views.calculator_painter_qualification, name='calculator_painter_qualification_html'),
    path('calculator/knowledge/', views.calculator_knowledge, name='calculator_knowledge'),
    path('calculator/knowledge.html', views.calculator_knowledge, name='calculator_knowledge_html'),
    path('calculator/support/', views.calculator_support, name='calculator_support'),
    path('calculator/support.html', views.calculator_support, name='calculator_support_html'),
    path('calculator/settings/', views.calculator_settings, name='calculator_settings'),
    path('calculator/settings.html', views.calculator_settings, name='calculator_settings_html'),
    re_path(r'^calculator/.*dashboard.*', views.calculator_dashboard),
    re_path(r'^calculator/.*coating-calculator.*', views.calculator_suite),
    re_path(r'^(?:calculator/)?.*specification-reading.*', views.calculator_specification_reading),
    re_path(r'^specification-reading.*', views.calculator_specification_reading),
    re_path(r'^(?:calculator/)?.*coating-procedure.*', views.calculator_procedure),
    re_path(r'^coating-procedure.*', views.calculator_procedure),
    re_path(r'^(?:calculator/)?.*unit-rate-estimation.*', views.calculator_unit_rate_estimation),
    re_path(r'^unit-rate-estimation.*', views.calculator_unit_rate_estimation),
    re_path(r'^(?:calculator/)?.*cost-estimation.*', views.calculator_unit_rate_estimation),
    re_path(r'^cost-estimation.*', views.calculator_unit_rate_estimation),
    re_path(r'^(?:calculator/)?.*manpower-estimation.*', views.calculator_manpower_estimation),
    re_path(r'^manpower-estimation.*', views.calculator_manpower_estimation),
    re_path(r'^(?:calculator/)?.*blaster-qualification.*', views.calculator_blaster_qualification),
    re_path(r'^blaster-qualification.*', views.calculator_blaster_qualification),
    re_path(r'^(?:calculator/)?.*blaster.*', views.calculator_blaster_qualification),
    re_path(r'^blaster.*', views.calculator_blaster_qualification),
    re_path(r'^(?:calculator/)?.*painter-qualification.*', views.calculator_painter_qualification),
    re_path(r'^painter-qualification.*', views.calculator_painter_qualification),
    re_path(r'^(?:calculator/)?.*painter.*', views.calculator_painter_qualification),
    re_path(r'^painter.*', views.calculator_painter_qualification),
    re_path(r'^calculator/.*knowledge.*', views.calculator_knowledge),
    re_path(r'^calculator/.*support.*', views.calculator_support),
    re_path(r'^calculator/.*settings.*', views.calculator_settings),
    path('board-frame/', views.board_frame, name='board_frame'),
    path('board_frame.html', views.board_frame, name='board_frame_html'),
]

