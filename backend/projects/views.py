from django.db import models, IntegrityError
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters
from drf_spectacular.utils import extend_schema

from .filters import ProjectFilter
from .models import Project, ProjectType, Technology, ProjectImage, ProjectViewLog
from .pagination import DefaultPagination
from .permissions import ReadOnlyOrAuthenticated
from .serializers import (
    ProjectSerializer,
    ProjectTypeSerializer,
    TechnologySerializer,
    ProjectImageSerializer,
)
from .utils import get_client_fingerprint


@extend_schema(tags=["Project Type"])
class ProjectTypeViewSet(viewsets.ModelViewSet):
    queryset = ProjectType.objects.all().order_by("name")
    serializer_class = ProjectTypeSerializer
    pagination_class = DefaultPagination
    permission_classes = [ReadOnlyOrAuthenticated]


@extend_schema(tags=["Technologies"])
class TechnologyViewSet(viewsets.ModelViewSet):
    queryset = Technology.objects.all().order_by("name")
    serializer_class = TechnologySerializer
    pagination_class = DefaultPagination
    permission_classes = [ReadOnlyOrAuthenticated]


@extend_schema(tags=["Projects"])
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by("-created_at")
    serializer_class = ProjectSerializer
    pagination_class = DefaultPagination
    permission_classes = [ReadOnlyOrAuthenticated]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = ProjectFilter

    search_fields = [
        "slug",
        "title__en",
        "title__ru",
        "title__uz",
        "description__en",
        "description__ru",
        "description__uz",
    ]

    ordering_fields = ["created_at", "slug", "project_type", "priority", "views"]
    ordering = ["-created_at"]

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return self._translate_response(request, response)

    def retrieve(self, request, *args, **kwargs):
        # unique device-based view tracking (IP + UA fingerprint)
        instance = self.get_object()
        fingerprint = get_client_fingerprint(request)
        try:
            ProjectViewLog.objects.create(project=instance, fingerprint=fingerprint)
            # atomic increment
            Project.objects.filter(pk=instance.pk).update(views=models.F("views") + 1)
        except IntegrityError:
            # already viewed from this device -> ignore
            pass

        response = super().retrieve(request, *args, **kwargs)

        # refresh response to include up-to-date views value
        # serializer run after update will pick refreshed value because we used DB update.
        return self._translate_response(request, response)

    @staticmethod
    def _translate_response(request, response):
        """
        If Accept-Language header is one of supported, replace title/description with that language string.
        Otherwise return full JSON (all languages).
        Fallback to 'en' if specific lang missing.
        """
        lang = request.headers.get("Accept-Language")
        if lang not in ["uz", "ru", "en"]:
            return response

        def translate_item(item):
            for field in ("title", "description"):
                if field in item and isinstance(item[field], dict):
                    item[field] = item[field].get(lang) or item[field].get("en") or ""
            return item

        if isinstance(response.data, dict) and "results" in response.data:
            response.data["results"] = [
                translate_item(i) for i in response.data["results"]
            ]
        elif isinstance(response.data, dict):
            response.data = translate_item(response.data)

        return response


@extend_schema(tags=["Project Images"])
class ProjectImageViewSet(viewsets.ModelViewSet):
    queryset = ProjectImage.objects.all().order_by("-uploaded_at")
    serializer_class = ProjectImageSerializer
    pagination_class = DefaultPagination
    permission_classes = [ReadOnlyOrAuthenticated]


from rest_framework import generics
from .models import ProjectInquiry
from .serializers import ProjectInquirySerializer


@extend_schema(tags=["Contact"])
class ProjectInquiryCreateView(generics.CreateAPIView):
    queryset = ProjectInquiry.objects.all()
    serializer_class = ProjectInquirySerializer
