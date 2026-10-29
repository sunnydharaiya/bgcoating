from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlasterRecordViewSet

router = DefaultRouter()
router.register(r'records', BlasterRecordViewSet, basename='blaster-record')

urlpatterns = [
    path('', include(router.urls)),
]
