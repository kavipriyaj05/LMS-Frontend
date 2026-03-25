import { useQuery } from '@tanstack/react-query'
import { leaveApi } from '../api/leaveApi'
import Layout from '../components/Layout'
import styles from './TeamPage.module.css'

export default function TeamPage() {
  const { data: team, isLoading } = useQuery({
    queryKey: ['team'],
    queryFn: () => leaveApi.getTeam().then(r => r.data)
  })

  return (
    <Layout>
      <div className={styles.wrapper}>
        <h2>My team</h2>
        {isLoading ? <p>Loading...</p> : (
          <div className={styles.grid}>
            {team?.map(member => (
              <div key={member.id} className={styles.card}>
                <div className={styles.avatar}>
                  {member.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className={styles.info}>
                  <span className={styles.name}>{member.fullName}</span>
                  <span className={styles.email}>{member.email}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}