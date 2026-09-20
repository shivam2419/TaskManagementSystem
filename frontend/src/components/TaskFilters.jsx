import { STATUS_OPTIONS } from './TaskForm.jsx'

export default function TaskFilters({ filters, onChange, onReset }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange({ ...filters, [name]: value })
  }

  return (
    <div className="card task-filters">
      <h2>Filter Tasks</h2>
      <div className="form-row">
        <label>
          Date
          <input type="date" name="date" value={filters.date} onChange={handleChange} />
        </label>
        <label>
          Task Name
          <input
            type="text"
            name="taskName"
            value={filters.taskName}
            onChange={handleChange}
            placeholder="Search by name"
          />
        </label>
        <label>
          Status
          <select name="status" value={filters.status} onChange={handleChange}>
            <option value="">All</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="secondary" onClick={onReset}>
          Clear Filters
        </button>
      </div>
    </div>
  )
}
