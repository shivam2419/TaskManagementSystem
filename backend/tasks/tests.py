from django.db import IntegrityError
from django.test import TestCase

from .models import Task


class TaskModelTests(TestCase):
    def test_task_supports_daily_work_notes_and_carry_forward_status(self):
        task = Task.objects.create(
            date='2026-09-20',
            task_name='Work items',
            description='Review the outstanding actions before the weekly meeting.',
            status='CARRIED_FORWARD',
            completion_note='Reviewed the updates and prepared the summary.',
            next_action='Send the follow-up email tomorrow morning.',
        )

        self.assertEqual(task.status, 'CARRIED_FORWARD')
        self.assertEqual(task.completion_note, 'Reviewed the updates and prepared the summary.')
        self.assertEqual(task.next_action, 'Send the follow-up email tomorrow morning.')

    def test_one_task_per_day_is_enforced_for_work_items(self):
        Task.objects.create(
            date='2026-09-20',
            task_name='Work items',
            description='Morning tasks',
        )

        with self.assertRaises(IntegrityError):
            Task.objects.create(
                date='2026-09-20',
                task_name='Work items',
                description='Afternoon tasks',
            )
