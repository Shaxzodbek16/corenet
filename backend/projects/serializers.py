from rest_framework import serializers

from .models import ProjectType, Technology, Project, ProjectImage


class ProjectTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectType
        fields = ["id", "name", "slug", "created_at", "updated_at"]
        read_only_fields = ("id", "slug", "created_at", "updated_at")


class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = ["id", "name", "slug", "created_at"]
        read_only_fields = ("id", "slug", "created_at")


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ["id", "project", "image", "alt_text", "is_cover", "uploaded_at"]
        read_only_fields = ("id", "uploaded_at")


class ProjectSerializer(serializers.ModelSerializer):
    # Use SlugRelatedFields for nicer write/read UX
    project_type = serializers.SlugRelatedField(
        slug_field="slug",
        queryset=ProjectType.objects.all(),
        required=False,
        allow_null=True,
    )
    technologies = serializers.SlugRelatedField(
        slug_field="slug", queryset=Technology.objects.all(), many=True, required=False
    )

    images = ProjectImageSerializer(many=True, read_only=True)
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "description",
            "slug",
            "project_type",
            "technologies",
            "repository_url",
            "live_url",
            "status",
            "views",
            "priority",
            "start_date",
            "end_date",
            "is_featured",
            "cover_image",
            "images",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ("id", "slug", "created_at", "updated_at", "views")

    def get_cover_image(self, obj):
        cover = obj.images.filter(is_cover=True).first()
        return cover.image.url if cover else None

    def _validate_translations(self, field, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError(
                {field: "Must be an object with language keys."}
            )
        missing = [lang for lang in ["uz", "ru", "en"] if lang not in value]
        if missing:
            raise serializers.ValidationError(
                {field: f"Missing translations: {', '.join(missing)}"}
            )
        return value

    def validate(self, data):
        # 'title' must be present on create; on partial update it may be absent
        if "title" in data:
            data["title"] = self._validate_translations("title", data["title"])
        if "description" in data and data["description"] is not None:
            data["description"] = self._validate_translations(
                "description", data["description"]
            )
        return data


from .models import ProjectInquiry


class ProjectInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectInquiry
        fields = "__all__"
        read_only_fields = ["id", "created_at"]
