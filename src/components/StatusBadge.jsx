import styles from './StatusBadge.module.css'

const map = {
  PENDING:   { label: 'Pending',   cls: 'pending'   },
  APPROVED:  { label: 'Approved',  cls: 'approved'  },
  REJECTED:  { label: 'Rejected',  cls: 'rejected'  },
  CANCELLED: { label: 'Cancelled', cls: 'cancelled' },
}

export default function StatusBadge({ status }) {
  const { label, cls } = map[status] || { label: status, cls: 'pending' }
  return <span className={`${styles.badge} ${styles[cls]}`}>{label}</span>
}