import { useNavigate, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Layout.module.css'

export default function Layout({ children }) {
  const { user, logout, isManager } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>LMS</div>
        <nav className={styles.nav}>
          {isManager ? (
            <>
              <NavLink to="/manager" end className={({isActive}) =>
                isActive ? styles.linkActive : styles.link}>Dashboard</NavLink>
              <NavLink to="/manager/requests" className={({isActive}) =>
                isActive ? styles.linkActive : styles.link}>Requests</NavLink>
              <NavLink to="/manager/team" className={({isActive}) =>
                isActive ? styles.linkActive : styles.link}>Team</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/employee" end className={({isActive}) =>
                isActive ? styles.linkActive : styles.link}>Dashboard</NavLink>
              <NavLink to="/employee/apply" className={({isActive}) =>
                isActive ? styles.linkActive : styles.link}>Apply leave</NavLink>
              <NavLink to="/employee/leaves" className={({isActive}) =>
                isActive ? styles.linkActive : styles.link}>My leaves</NavLink>
            </>
          )}
        </nav>
        <div className={styles.footer}>
          <span className={styles.userName}>{user?.fullName}</span>
          <span className={styles.userRole}>{user?.userType}</span>
          <button className={styles.logout} onClick={handleLogout}>Sign out</button>
        </div>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  )
}