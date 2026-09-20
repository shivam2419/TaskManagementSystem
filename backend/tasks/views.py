from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .ai_summary import generate_task_summary
from .filters import TaskFilter
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filterset_class = TaskFilter

    @action(detail=False, methods=['post'])
    def summary(self, request):
        from_date = request.data.get('from_date')
        to_date = request.data.get('to_date')

        if not from_date or not to_date:
            return Response(
                {'error': 'Both from_date and to_date are required (YYYY-MM-DD).'},
                status=400,
            )

        tasks = Task.objects.filter(date__gte=from_date, date__lte=to_date).order_by('date')

        if not tasks.exists():
            return Response(
                {
                    'summary': 'No tasks found in the selected date range.',
                    'task_count': 0,
                    'tasks': [],
                }
            )

        summary_text = generate_task_summary(tasks, from_date, to_date)
        serializer = TaskSerializer(tasks, many=True)
        return Response(
            {
                'summary': summary_text,
                'task_count': tasks.count(),
                'tasks': serializer.data,
            }
        )
