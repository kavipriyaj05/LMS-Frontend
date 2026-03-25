import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { leaveApi } from '../api/leaveApi'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import styles from './ManagerDashboard.module.css'

export default function ManagerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data } = useQuery({
    queryKey: ['teamLeaves', 'PENDING', 0],
    queryFn: () => leaveApi.getTeamLeaves('PENDING', 0, 5).then(r => r.data)
  })

  const pending = data?.content || []

  return (
    <Layout>
      <div className={styles.wrapper}>
        <h2>Manager dashboard — {user?.fullName}</h2>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.num}>{data?.totalElements ?? 0}</span>
            <span className={styles.label}>Pending requests</span>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Pending approvals</h3>
            <button className={styles.viewAll}
              onClick={() => navigate('/manager/requests')}>View all</button>
          </div>
          {pending.length === 0
            ? <p className={styles.empty}>No pending requests</p>
            : pending.map(l => (
              <div key={l.id} className={styles.leaveRow}>
                <div>
                  <span className={styles.name}>{l.employeeName}</span>
                  <span className={styles.dates}>{l.startDate} → {l.endDate}</span>
                </div>
                <StatusBadge status={l.status} />
              </div>
            ))
          }
        </div>
      </div>
    </Layout>
  )
}