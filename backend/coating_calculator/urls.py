from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CalculatorLogViewSet

router = DefaultRouter()
router.register('logs', CalculatorLogViewSet, basename='calculatorlog')

urlpatterns = [
    path('', include(router.urls)),
]
