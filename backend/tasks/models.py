from django.db import models


class Task(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        COMPLETED = 'COMPLETED', 'Completed'
        CARRIED_FORWARD = 'CARRIED_FORWARD', 'Carried Forward'
        ABANDONED = 'ABANDONED', 'Abandoned'

    date = models.DateField(unique=True)
    task_name = models.CharField(max_length=255, default='Work items')
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=25, choices=Status.choices, default=Status.PENDING
    )
    completion_note = models.TextField(blank=True, default='')
    next_action = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f'{self.date} - {self.task_name}'
