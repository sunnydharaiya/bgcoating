from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UnitRateRecordViewSet

router = DefaultRouter()
router.register('records', UnitRateRecordViewSet, basename='unitrate-record')
router.register('', UnitRateRecordViewSet, basename='unitrate-default')

urlpatterns = [
    path('', include(router.urls)),
]
