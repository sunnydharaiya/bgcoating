from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PainterRecordViewSet

router = DefaultRouter()
router.register(r'records', PainterRecordViewSet, basename='painter-records')

urlpatterns = [
    path('', include(router.urls)),
]
