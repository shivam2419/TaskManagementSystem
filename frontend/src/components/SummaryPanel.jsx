import { useState } from 'react'

export default function SummaryPanel({ onGenerate }) {
  const today = new Date().toISOString().slice(0, 10)
  const [fromDate, setFromDate] = useState(today)
  const [toDate, setToDate] = useState(today)
  const [summary, setSummary] = useState(null)
  const [taskCount, setTaskCount] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerate = async () => {
    if (!fromDate || !toDate) {
      setError('Please select both from and to dates.')
      return
    }
    if (fromDate > toDate) {
      setError('From date must be before or equal to the to date.')
      return
    }
    setLoading(true)
    setError(null)
    setSummary(null)
    try {
      const result = await onGenerate(fromDate, toDate)
      setSummary(result.summary)
      setTaskCount(result.task_count)
    } catch (err) {
      setError('Failed to generate summary. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card summary-panel">
      <h2>AI Task Summary</h2>
      <p className="hint">Pick a date range and let AI summarize what you worked on.</p>
      <div className="form-row">
        <label>
          From
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </label>
        <label>
          To
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </label>
        <button type="button" className="summary-button" onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Summary'}
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {summary && (
        <div className="summary-result">
          <h3>Summary ({taskCount} task{taskCount === 1 ? '' : 's'})</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  )
}
