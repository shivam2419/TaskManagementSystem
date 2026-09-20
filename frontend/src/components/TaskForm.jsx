import { useState } from 'react'

const STATUS_STYLES = {
  PENDING: { label: 'Pending', color: '#facc15', background: '#2d2a1d' },
  IN_PROGRESS: { label: 'In Progress', color: '#7dd3fc', background: '#142d3d' },
  COMPLETED: { label: 'Completed', color: '#86efac', background: '#112d1d' },
  CARRIED_FORWARD: { label: 'Carried Forward', color: '#f9a8d4', background: '#3a2234' },
  ABANDONED: { label: 'Abandoned', color: '#fca5a5', background: '#3b2020' },
}

const STATUS_OPTIONS = Object.entries(STATUS_STYLES).map(([value, details]) => ({
  value,
  label: details.label,
  ...details,
}))

const emptyTask = {
  date: new Date().toISOString().slice(0, 10),
  task_name: 'Work items',
  description: '',
  status: 'PENDING',
  completion_note: '',
  next_action: '',
}

export default function TaskForm({ onCreate }) {
  const [task, setTask] = useState(emptyTask)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setTask((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!task.task_name.trim() || !task.date) {
      setError('Date and task name are required.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await onCreate(task)
      setTask({ ...emptyTask, date: task.date })
    } catch (err) {
      setError('Failed to add task. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="card task-form" onSubmit={handleSubmit}>
      <div className="card-heading">
        <div>
          <p className="eyebrow">Add work item</p>
          <h2>New task log</h2>
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="form-row">
        <label>
          Date
          <input type="date" name="date" value={task.date} onChange={handleChange} required />
        </label>
        <label>
          Status
          <select
            name="status"
            value={task.status}
            onChange={handleChange}
            className={`status-select status-${task.status}`}
            style={{
              color: STATUS_STYLES[task.status]?.color,
              backgroundColor: STATUS_STYLES[task.status]?.background,
            }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                style={{
                  color: opt.color,
                  backgroundColor: opt.background,
                }}
              >
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Task Name
        <input
          type="text"
          name="task_name"
          value={task.task_name}
          onChange={handleChange}
          placeholder="Work items"
          readOnly
        />
      </label>
      <label>
        Work items for this day
        <textarea
          name="description"
          value={task.description}
          onChange={handleChange}
          rows={4}
          placeholder="Write the work items you want to complete for this date..."
        />
      </label>
      <div className="form-row stacked-row">
        <label>
          What was done?
          <textarea
            name="completion_note"
            value={task.completion_note}
            rows={3}
            onChange={handleChange}
            placeholder="Document what was completed before sign-off..."
          />
        </label>
        <label>
          Next action
          <textarea
            name="next_action"
            value={task.next_action}
            rows={3}
            onChange={handleChange}
            placeholder="If pending, decide what should happen next or whether it should be dropped..."
          />
        </label>
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Adding...' : 'Add work item'}
      </button>
    </form>
  )
}

export { STATUS_OPTIONS }
