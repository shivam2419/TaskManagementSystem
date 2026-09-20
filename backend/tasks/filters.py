import django_filters

from .models import Task


class TaskFilter(django_filters.FilterSet):
    date = django_filters.DateFilter(field_name='date', lookup_expr='exact')
    date_from = django_filters.DateFilter(field_name='date', lookup_expr='gte')
    date_to = django_filters.DateFilter(field_name='date', lookup_expr='lte')
    task_name = django_filters.CharFilter(field_name='task_name', lookup_expr='icontains')
    status = django_filters.CharFilter(field_name='status', lookup_expr='exact')

    class Meta:
        model = Task
        fields = ['date', 'date_from', 'date_to', 'task_name', 'status']
