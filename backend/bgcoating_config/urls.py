"""
URL configuration for bgcoating_config project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/modules/calculator/', include('coating_calculator.urls')),
    path('api/v1/coating-calculator/', include('coating_calculator.urls')),
    path('api/v1/modules/specification-reading/', include('specification_reading.urls')),
    path('api/v1/specification-reading/', include('specification_reading.urls')),
    path('api/v1/modules/coating-procedure/', include('coating_procedure.urls')),
    path('api/v1/coating-procedure/', include('coating_procedure.urls')),
    path('api/v1/modules/unit-rate-estimation/', include('unit_rate_estimation.urls')),
    path('api/v1/unit-rate-estimation/', include('unit_rate_estimation.urls')),
    path('api/v1/modules/manpower-estimation/', include('manpower_estimation.urls')),
    path('api/v1/manpower-estimation/', include('manpower_estimation.urls')),
    path('api/v1/modules/blaster-qualification/', include('blaster_qualification.urls')),
    path('api/v1/blaster-qualification/', include('blaster_qualification.urls')),
    path('api/v1/modules/painter-qualification/', include('painter_qualification.urls')),
    path('api/v1/painter-qualification/', include('painter_qualification.urls')),
    path('', include('website.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
