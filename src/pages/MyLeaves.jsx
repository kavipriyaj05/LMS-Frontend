import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { leaveApi } from '../api/leaveApi'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import styles from './MyLeaves.module.css'

export default function MyLeaves() {
  const [page, setPage] = useState(0)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['myLeaves', page],
    queryFn: () => leaveApi.getMyLeaves(page, 10).then(r => r.data)
  })

  const cancel = useMutation({
    mutationFn: (id) => leaveApi.cancelLeave(id),
    onSuccess: () => queryClient.invalidateQueries(['myLeaves'])
  })

  return (
    <Layout>
      <div className={styles.wrapper}>
        <h2>My leave history</h2>
        {isLoading ? <p>Loading...</p> : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>From</th><th>To</th><th>Days</th>
                  <th>Reason</th><th>Status</th><th>Applied</th><th></th>
                </tr>
              </thead>
              <tbody>
                {data?.content?.map(leave => {
                  const days = Math.round(
                    (new Date(leave.endDate) - new Date(leave.startDate)) / 86400000
                  ) + 1
                  return (
                    <tr key={leave.id}>
                      <td>{leave.startDate}</td>
                      <td>{leave.endDate}</td>
                      <td>{days}d</td>
                      <td className={styles.reason}>{leave.reason}</td>
                      <td><StatusBadge status={leave.status} /></td>
                      <td>{new Date(leave.appliedAt).toLocaleDateString()}</td>
                      <td>
                        {leave.status === 'PENDING' && (
                          <button className={styles.cancelBtn}
                            onClick={() => cancel.mutate(leave.id)}>
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className={styles.pagination}>
              <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</button>
              <span>Page {page + 1} of {data?.totalPages}</span>
              <button disabled={page >= data?.totalPages - 1} onClick={() => setPage(p => p + 1)}>
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}