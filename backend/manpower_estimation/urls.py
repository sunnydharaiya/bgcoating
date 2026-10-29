from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ManpowerRecordViewSet

router = DefaultRouter()
router.register(r'records', ManpowerRecordViewSet, basename='manpower-record')

urlpatterns = [
    path('', include(router.urls)),
]
