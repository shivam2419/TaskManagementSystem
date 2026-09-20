import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://taskmanagementsystem-jgqd.onrender.com/api'

const client = axios.create({
  baseURL: API_BASE_URL,
})

export const fetchTasks = (filters = {}) => {
  const params = {}
  if (filters.date) params.date = filters.date
  if (filters.taskName) params.task_name = filters.taskName
  if (filters.status) params.status = filters.status
  return client
    .get('/tasks/', { params })
    .then((res) => (Array.isArray(res.data) ? res.data : res.data.results))
}

export const createTask = (task) => client.post('/tasks/', task).then((res) => res.data)

export const updateTask = (id, task) => client.put(`/tasks/${id}/`, task).then((res) => res.data)

export const deleteTask = (id) => client.delete(`/tasks/${id}/`)

export const fetchSummary = (fromDate, toDate) =>
  client
    .post('/tasks/summary/', { from_date: fromDate, to_date: toDate })
    .then((res) => res.data)

export default client
