from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SpecificationRecordViewSet

router = DefaultRouter()
router.register('records', SpecificationRecordViewSet, basename='spec-reading-record')
router.register('', SpecificationRecordViewSet, basename='spec-reading-default')

urlpatterns = [
    path('', include(router.urls)),
]
