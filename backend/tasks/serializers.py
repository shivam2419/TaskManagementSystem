from rest_framework import serializers

from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Task
        fields = [
            'id',
            'date',
            'task_name',
            'description',
            'status',
            'status_display',
            'completion_note',
            'next_action',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, attrs):
        date = attrs.get('date') or getattr(self.instance, 'date', None)
        task_name = attrs.get('task_name', getattr(self.instance, 'task_name', 'Work items'))

        if not date:
            return attrs

        queryset = Task.objects.filter(date=date)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists() and task_name == 'Work items':
            raise serializers.ValidationError('A work log already exists for this date. Update it instead of creating a duplicate.')

        return attrs
