from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProcedureRecordViewSet

router = DefaultRouter()
router.register('records', ProcedureRecordViewSet, basename='procedure-record')
router.register('', ProcedureRecordViewSet, basename='procedure-default')

urlpatterns = [
    path('', include(router.urls)),
]
