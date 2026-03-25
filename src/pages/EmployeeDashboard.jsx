import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { leaveApi } from '../api/leaveApi'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import styles from './EmployeeDashboard.module.css'

export default function EmployeeDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data } = useQuery({
    queryKey: ['myLeaves', 0],
    queryFn: () => leaveApi.getMyLeaves(0, 5).then(r => r.data)
  })

  const leaves = data?.content || []
  const pending = leaves.filter(l => l.status === 'PENDING').length
  const approved = leaves.filter(l => l.status === 'APPROVED').length

  return (
    <Layout>
      <div className={styles.wrapper}>
        <h2>Welcome, {user?.fullName}</h2>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{leaves.length}</span>
            <span className={styles.statLabel}>Total requests</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{pending}</span>
            <span className={styles.statLabel}>Pending</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{approved}</span>
            <span className={styles.statLabel}>Approved</span>
          </div>
        </div>
        <button className={styles.applyBtn} onClick={() => navigate('/employee/apply')}>
          + Apply for leave
        </button>
        <h3>Recent leaves</h3>
        {leaves.map(l => (
          <div key={l.id} className={styles.leaveRow}>
            <span>{l.startDate} → {l.endDate}</span>
            <span className={styles.reason}>{l.reason.slice(0, 50)}</span>
            <StatusBadge status={l.status} />
          </div>
        ))}
        <button className={styles.viewAll} onClick={() => navigate('/employee/leaves')}>
          View all leaves
        </button>
      </div>
    </Layout>
  )
}