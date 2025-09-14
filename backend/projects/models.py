import uuid

from django.db import models
from django.utils import timezone
from django.utils.text import slugify


class SluggedModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(unique=True, max_length=255, blank=True)

    class Meta:
        abstract = True

    def generate_slug(self, base_value: str, max_length: int = 250) -> str:
        slug = slugify(base_value)[:max_length]
        orig_slug = slug
        counter = 1
        ModelClass = self.__class__

        while ModelClass.objects.filter(slug=slug).exclude(pk=self.pk).exists():
            slug = f"{orig_slug}-{counter}"
            counter += 1
        return slug

    def save(self, *args, **kwargs):
        if not self.slug:
            base_field = getattr(self, "name", None) or getattr(self, "title", None)
            # For JSON multilingual title
            if isinstance(base_field, dict):
                base_value = base_field.get("en") or next(iter(base_field.values()), "")
            else:
                base_value = str(base_field)
            self.slug = self.generate_slug(base_value)
        super().save(*args, **kwargs)


class ProjectType(SluggedModel):
    name = models.CharField(max_length=100, unique=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "project_types"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Technology(SluggedModel):
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "technologies"
        ordering = ["name"]

    def __str__(self):
        return self.name


class ProjectStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    IN_PROGRESS = "in_progress", "In Progress"
    COMPLETED = "completed", "Completed"
    ARCHIVED = "archived", "Archived"


class Project(SluggedModel):
    title = models.JSONField()  # multilingual
    description = models.JSONField(blank=True, null=True)

    project_type = models.ForeignKey(
        ProjectType, on_delete=models.SET_NULL, null=True, related_name="projects"
    )
    technologies = models.ManyToManyField(
        Technology, related_name="projects", blank=True
    )

    repository_url = models.URLField(blank=True, null=True)
    live_url = models.URLField(blank=True, null=True)

    status = models.CharField(
        max_length=20,
        choices=ProjectStatus.choices,
        default=ProjectStatus.DRAFT,
    )

    views = models.PositiveIntegerField(default=0)
    priority = models.IntegerField(default=0)

    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)

    is_featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "projects"
        ordering = ["-created_at"]

    def __str__(self):
        return (
            self.title.get("en", "Untitled")
            if isinstance(self.title, dict)
            else str(self.title)
        )


class ProjectImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="projects/")
    alt_text = models.CharField(max_length=255, blank=True)

    is_cover = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "project_images"
        ordering = ["-uploaded_at"]

    def __str__(self):
        return f"{self.project} - {self.image}"


class ProjectViewLog(models.Model):
    project = models.ForeignKey(
        "Project", on_delete=models.CASCADE, related_name="view_logs"
    )
    fingerprint = models.CharField(max_length=64, db_index=True)
    viewed_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ("project", "fingerprint")
        indexes = [models.Index(fields=("project", "fingerprint"))]

    def __str__(self):
        return f"view:{self.project.id}:{self.fingerprint[:8]}"


class ProjectInquiry(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, null=True)
    phone_number = models.CharField(max_length=20)
    telegram_username = models.CharField(max_length=100, blank=True, null=True)
    project_description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} - {self.phone_number}"
