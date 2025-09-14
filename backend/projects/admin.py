from django.contrib import admin

from .models import (
    ProjectType,
    Technology,
    Project,
    ProjectImage,
    ProjectViewLog,
    ProjectInquiry,
)


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1
    fields = ("image", "alt_text", "is_cover")
    readonly_fields = ("uploaded_at",)


@admin.register(ProjectType)
class ProjectTypeAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "created_at", "updated_at")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("name",)


@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "created_at")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("name",)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "__str__",
        "slug",
        "get_title",
        "project_type",
        "status",
        "is_featured",
        "priority",
        "views",
        "created_at",
        "updated_at",
    )
    list_filter = (
        "status",
        "is_featured",
        ("project_type", admin.RelatedOnlyFieldListFilter),
        ("technologies", admin.RelatedOnlyFieldListFilter),
    )
    search_fields = ("slug",)
    ordering = ("-created_at",)
    inlines = [ProjectImageInline]
    filter_horizontal = ("technologies",)
    readonly_fields = ("created_at", "updated_at")

    def get_title(self, obj):
        # Default to request Accept-Language if available; fallback to en
        request = getattr(self, "request", None)
        lang = "en"
        if request:
            header = request.headers.get("Accept-Language")
            if header in ("uz", "ru", "en"):
                lang = header
        return obj.title.get(lang, obj.title.get("en", "—"))

    get_title.short_description = "Title"

    def changelist_view(self, request, extra_context=None):
        self.request = request
        return super().changelist_view(request, extra_context)

    def change_view(self, request, object_id, form_url="", extra_context=None):
        self.request = request
        return super().change_view(request, object_id, form_url, extra_context)


@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ("project", "image", "is_cover", "uploaded_at")
    list_filter = ("is_cover", "uploaded_at")
    search_fields = ("project__title", "alt_text")
    ordering = ("-uploaded_at",)


@admin.register(ProjectViewLog)
class ProjectViewLogAdmin(admin.ModelAdmin):
    list_display = ("project", "fingerprint", "viewed_at")
    search_fields = ("fingerprint",)
    ordering = ("-viewed_at",)


@admin.register(ProjectInquiry)
class ProjectInquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone_number", "telegram_username", "created_at")
    search_fields = ("name", "email", "phone_number", "telegram_username")
    list_filter = ("created_at",)
    ordering = ("-created_at",)
