"""Generates a natural-language summary of tasks in a date range.

Uses OpenAI when OPENAI_API_KEY is configured, otherwise falls back to a
rule-based summary so the feature still works out of the box.
"""
from django.conf import settings


def generate_task_summary(tasks, from_date, to_date):
    api_key = settings.OPENAI_API_KEY

    if api_key:
        try:
            return _generate_ai_summary(tasks, from_date, to_date, api_key)
        except Exception as exc:  # noqa: BLE001 - surface any provider error as a fallback note
            return _generate_fallback_summary(tasks, from_date, to_date, error=str(exc))

    return _generate_fallback_summary(tasks, from_date, to_date)


def _generate_ai_summary(tasks, from_date, to_date, api_key):
    from openai import OpenAI

    task_lines = [
        f"- [{task.date}] {task.task_name} ({task.get_status_display()}): "
        f"{task.description or 'No description'}"
        for task in tasks
    ]
    tasks_text = "\n".join(task_lines)

    prompt = (
        f"Summarize the following work tasks logged between {from_date} and {to_date}. "
        "Write a concise, professional summary in a short paragraph (or brief bullet points), "
        "grouping related work together and calling out what was completed versus still "
        "in progress or pending.\n\nTasks:\n"
        f"{tasks_text}"
    )

    client = OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant that writes clear, professional work summaries.",
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0.4,
    )
    return response.choices[0].message.content.strip()


def _generate_fallback_summary(tasks, from_date, to_date, error=None):
    total = tasks.count()
    completed = tasks.filter(status='COMPLETED').count()
    in_progress = tasks.filter(status='IN_PROGRESS').count()
    pending = tasks.filter(status='PENDING').count()
    carried_forward = tasks.filter(status='CARRIED_FORWARD').count()
    abandoned = tasks.filter(status='ABANDONED').count()
    names = ", ".join(task.task_name for task in tasks[:10])

    note = (
        f" (AI summary unavailable: {error}. Showing a rule-based summary instead.)"
        if error
        else " (Set OPENAI_API_KEY in the backend .env to enable AI-generated summaries.)"
    )

    return (
        f"Between {from_date} and {to_date}, {total} task(s) were logged: "
        f"{completed} completed, {in_progress} in progress, {pending} pending, "
        f"{carried_forward} carried forward, {abandoned} abandoned. "
        f"Key tasks: {names}.{note}"
    )
