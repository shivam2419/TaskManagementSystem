# Task Management System

A simple task management app with Django REST Framework backend and React (Vite) frontend.

Features:
- Add tasks with **Date**, **Task Name**, **Description**, **Task Status**.
- Filter tasks by date, task name, and status.
- Select a date range and generate an AI summary of what was done in that period
  (uses OpenAI if `OPENAI_API_KEY` is configured, otherwise falls back to a
  rule-based summary so it works without any API key).

## Project Structure

```
taskmanagement/
  backend/    Django + Django REST Framework API
  frontend/   React + Vite app
```

## Backend Setup

```powershell
cd taskmanagement/backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env      # optionally add OPENAI_API_KEY
python manage.py migrate
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/api/`.

Key endpoints:
- `GET /api/tasks/` — list tasks. Supports query params: `date`, `date_from`, `date_to`, `task_name` (contains match), `status`.
- `POST /api/tasks/` — create a task (`date`, `task_name`, `description`, `status`).
- `PUT/PATCH /api/tasks/{id}/` — update a task.
- `DELETE /api/tasks/{id}/` — delete a task.
- `POST /api/tasks/summary/` — body `{ "from_date": "YYYY-MM-DD", "to_date": "YYYY-MM-DD" }`, returns an AI-generated summary of tasks in that range.

## Frontend Setup

```powershell
cd taskmanagement/frontend
npm install
copy .env.example .env      # adjust VITE_API_BASE_URL if needed
npm run dev
```

The app will be available at `http://localhost:5173`.

## Enabling real AI summaries

By default (no `OPENAI_API_KEY`), the summary endpoint returns a rule-based
summary (counts by status + key task names). To get a genuine AI-written
summary, set `OPENAI_API_KEY` (and optionally `OPENAI_MODEL`, default
`gpt-4o-mini`) in `backend/.env`, then restart the Django server.
