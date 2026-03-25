import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { leaveApi } from '../api/leaveApi'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import styles from './PendingRequests.module.css'

export default function PendingRequests() {
  const [filter, setFilter] = useState('PENDING')
  const [page, setPage] = useState(0)
  const [remarks, setRemarks] = useState({})
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['teamLeaves', filter, page],
    queryFn: () => leaveApi.getTeamLeaves(filter, page, 10).then(r => r.data)
  })

  const approve = useMutation({
    mutationFn: ({ id }) => leaveApi.approveLeave(id, remarks[id] || ''),
    onSuccess: () => queryClient.invalidateQueries(['teamLeaves'])
  })

  const reject = useMutation({
    mutationFn: ({ id }) => leaveApi.rejectLeave(id, remarks[id] || ''),
    onSuccess: () => queryClient.invalidateQueries(['teamLeaves'])
  })

  const leaves = data?.content || []

  return (
    <Layout>
      <div className={styles.wrapper}>
        <h2>Leave requests</h2>
        <div className={styles.filters}>
          {['PENDING','APPROVED','REJECTED'].map(s => (
            <button key={s}
              className={`${styles.filter} ${filter === s ? styles.active : ''}`}
              onClick={() => { setFilter(s); setPage(0) }}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        {isLoading ? <p>Loading...</p> : leaves.length === 0
          ? <p className={styles.empty}>No {filter.toLowerCase()} requests</p>
          : leaves.map(leave => {
            const days = Math.round(
              (new Date(leave.endDate) - new Date(leave.startDate)) / 86400000
            ) + 1
            return (
              <div key={leave.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <span className={styles.name}>{leave.employeeName}</span>
                    <span className={styles.dates}>
                      {leave.startDate} → {leave.endDate} ({days}d)
                    </span>
                  </div>
                  <StatusBadge status={leave.status} />
                </div>
                <p className={styles.reason}>{leave.reason}</p>
                <p className={styles.applied}>
                  Applied: {new Date(leave.appliedAt).toLocaleString()}
                </p>
                {leave.status === 'PENDING' && (
                  <div className={styles.actions}>
                    <input
                      type="text"
                      placeholder="Remarks (optional)"
                      value={remarks[leave.id] || ''}
                      onChange={e => setRemarks(r => ({ ...r, [leave.id]: e.target.value }))}
                      className={styles.remarkInput}
                    />
                    <button className={styles.approveBtn}
                      onClick={() => approve.mutate({ id: leave.id })}
                      disabled={approve.isPending}>Approve</button>
                    <button className={styles.rejectBtn}
                      onClick={() => reject.mutate({ id: leave.id })}
                      disabled={reject.isPending}>Reject</button>
                  </div>
                )}
              </div>
            )
          })
        }
        <div className={styles.pagination}>
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</button>
          <span>Page {page + 1} of {data?.totalPages || 1}</span>
          <button disabled={page >= (data?.totalPages || 1) - 1}
            onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      </div>
    </Layout>
  )
}