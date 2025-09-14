import django_filters

from .models import Project


class ProjectFilter(django_filters.FilterSet):
    status = django_filters.CharFilter(field_name="status", lookup_expr="iexact")
    is_featured = django_filters.BooleanFilter(field_name="is_featured")
    project_type = django_filters.CharFilter(
        field_name="project_type__slug", lookup_expr="iexact"
    )
    technologies = django_filters.CharFilter(method="filter_technologies")

    start_date_after = django_filters.DateFilter(
        field_name="start_date", lookup_expr="gte"
    )
    end_date_before = django_filters.DateFilter(
        field_name="end_date", lookup_expr="lte"
    )

    @staticmethod
    def filter_technologies(queryset, name, value):
        tech_slugs = [v.strip() for v in value.split(",") if v.strip()]
        return queryset.filter(technologies__slug__in=tech_slugs).distinct()

    class Meta:
        model = Project
        fields = ["status", "is_featured", "project_type"]
