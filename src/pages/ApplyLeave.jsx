import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { leaveApi } from '../api/leaveApi'
import Layout from '../components/Layout'
import styles from './ApplyLeave.module.css'

export default function ApplyLeave() {
  const today = new Date().toISOString().split('T')[0]
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const days = startDate && endDate
    ? Math.max(0, Math.round((new Date(endDate) - new Date(startDate)) / 86400000) + 1)
    : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (days > 9) { setError('Leave cannot exceed 9 days'); return }
    setLoading(true)
    try {
      await leaveApi.applyLeave({ startDate, endDate, reason })
      setSuccess(true)
      setTimeout(() => navigate('/employee/leaves'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply for leave')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className={styles.wrapper}>
        <h2>Apply for leave</h2>
        {success && <div className={styles.success}>Leave applied successfully! Redirecting...</div>}
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Start date</label>
              <input type="date" value={startDate} min={today}
                onChange={e => setStartDate(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label>End date</label>
              <input type="date" value={endDate} min={startDate}
                onChange={e => setEndDate(e.target.value)} required />
            </div>
          </div>
          <div className={styles.daysBadge}>
            {days} day{days !== 1 ? 's' : ''} selected
            {days > 9 && <span className={styles.warn}> — exceeds 9-day limit</span>}
          </div>
          <div className={styles.field}>
            <label>Reason</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)}
              rows={4} placeholder="Describe your reason..." required />
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.cancel}
              onClick={() => navigate('/employee')}>Cancel</button>
            <button type="submit" className={styles.submit} disabled={loading || days > 9}>
              {loading ? 'Submitting...' : 'Submit leave'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}