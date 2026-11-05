from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InspectionRecordViewSet

router = DefaultRouter()
router.register(r'records', InspectionRecordViewSet, basename='inspection-record')

urlpatterns = [
    path('', include(router.urls)),
]
