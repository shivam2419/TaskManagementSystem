const STATUS_STYLES = {
  PENDING: { label: 'Pending', color: '#facc15', background: '#2d2a1d' },
  IN_PROGRESS: { label: 'In Progress', color: '#7dd3fc', background: '#142d3d' },
  COMPLETED: { label: 'Completed', color: '#86efac', background: '#112d1d' },
  CARRIED_FORWARD: { label: 'Carried Forward', color: '#f9a8d4', background: '#3a2234' },
  ABANDONED: { label: 'Abandoned', color: '#fca5a5', background: '#3b2020' },
}

const STATUS_LABELS = Object.fromEntries(
  Object.entries(STATUS_STYLES).map(([key, value]) => [key, value.label]),
)

export default function TaskList({ tasks, loading, onDelete, onFieldChange, onSave }) {
  if (loading) {
    return <div className="card muted-card">Loading daily tasks...</div>
  }

  if (!tasks.length) {
    return <div className="card muted-card">No tasks found. Add a fresh work item, or adjust the filters.</div>
  }

  return (
    <div className="card task-board">
      <div className="card-heading">
        <div>
          <p className="eyebrow">Daily log</p>
          <h2>Work items - {tasks[0]?.date || 'Today'}</h2>
        </div>
      </div>
      <div className="task-table-wrap">
        <table className="task-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Task</th>
              <th>Work items</th>
              <th>Status</th>
              <th>Completed</th>
              <th>Next action</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.date}</td>
                <td>
                  <strong>{task.task_name}</strong>
                </td>
                <td className="description-cell">{task.description || '—'}</td>
                <td>
                  <select
                    value={task.status}
                    className={`status-select status-${task.status}`}
                    style={{
                      color: STATUS_STYLES[task.status]?.color,
                      backgroundColor: STATUS_STYLES[task.status]?.background,
                    }}
                    onChange={(e) => {
                      onFieldChange(task.id, 'status', e.target.value)
                      onSave({ ...task, status: e.target.value })
                    }}
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option
                        key={value}
                        value={value}
                        style={{
                          color: STATUS_STYLES[value]?.color,
                          backgroundColor: STATUS_STYLES[value]?.background,
                        }}
                      >
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <textarea
                    value={task.completion_note || ''}
                    rows={3}
                    onChange={(e) => onFieldChange(task.id, 'completion_note', e.target.value)}
                    onBlur={() => onSave(task)}
                    placeholder="What was finished?"
                  />
                </td>
                <td>
                  <textarea
                    value={task.next_action || ''}
                    rows={3}
                    onChange={(e) => onFieldChange(task.id, 'next_action', e.target.value)}
                    onBlur={() => onSave(task)}
                    placeholder="Carry forward or abandon?"
                  />
                </td>
                <td>
                  <button type="button" className="secondary danger" onClick={() => onDelete(task.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
