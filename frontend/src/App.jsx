import { useEffect, useState, useCallback } from 'react'
import TaskForm from './components/TaskForm.jsx'
import TaskFilters from './components/TaskFilters.jsx'
import TaskList from './components/TaskList.jsx'
import SummaryPanel from './components/SummaryPanel.jsx'
import { fetchTasks, createTask, updateTask, deleteTask, fetchSummary } from './api.js'

const emptyFilters = { date: '', taskName: '', status: '' }

export default function App() {
  const [tasks, setTasks] = useState([])
  const [filters, setFilters] = useState(emptyFilters)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  const loadTasks = useCallback(async (activeFilters) => {
    setLoading(true)
    setLoadError(null)
    try {
      const data = await fetchTasks(activeFilters)
      setTasks(data)
    } catch (err) {
      setLoadError('Could not load tasks. Is the backend server running?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTasks(filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const handleCreate = async (task) => {
    await createTask(task)
    await loadTasks(filters)
  }

  const handleDelete = async (id) => {
    await deleteTask(id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const handleTaskFieldChange = (taskId, field, value) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, [field]: value } : task)),
    )
  }

  const handleTaskSave = async (task) => {
    const updated = await updateTask(task.id, task)
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)))
  }

  const handleGenerateSummary = (fromDate, toDate) => fetchSummary(fromDate, toDate)

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Office Work Journal</p>
          <h1>Daily Work Tracker</h1>
        </div>
        <p className="header-copy">
          Capture tasks across the day, update progress before sign-off, and carry forward what remains.
        </p>
      </header>

      <main className="app-content">
        <TaskForm onCreate={handleCreate} />
        <SummaryPanel onGenerate={handleGenerateSummary} />
        <TaskFilters filters={filters} onChange={setFilters} onReset={() => setFilters(emptyFilters)} />
        {loadError && <div className="card error-message">{loadError}</div>}
        <TaskList
          tasks={tasks}
          loading={loading}
          onDelete={handleDelete}
          onFieldChange={handleTaskFieldChange}
          onSave={handleTaskSave}
        />
      </main>
    </div>
  )
}
