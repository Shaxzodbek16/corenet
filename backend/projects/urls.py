from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ProjectViewSet,
    ProjectTypeViewSet,
    TechnologyViewSet,
    ProjectImageViewSet,
    ProjectInquiryCreateView,
)

router = DefaultRouter()
router.register(r"projects", ProjectViewSet, basename="projects")
router.register(r"project-types", ProjectTypeViewSet, basename="project-types")
router.register(r"technologies", TechnologyViewSet, basename="technologies")
router.register(r"project-images", ProjectImageViewSet, basename="project-images")

urlpatterns = [
    path("projects/", include(router.urls)),
    path(
        "contacts/", ProjectInquiryCreateView.as_view(), name="project-inquiry-create"
    ),
]
