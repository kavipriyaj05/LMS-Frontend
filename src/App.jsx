import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import EmployeeDashboard from './pages/EmployeeDashboard'
import ApplyLeave from './pages/ApplyLeave'
import MyLeaves from './pages/MyLeaves'
import ManagerDashboard from './pages/ManagerDashboard'
import PendingRequests from './pages/PendingRequests'
import TeamPage from './pages/TeamPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route element={<ProtectedRoute requiredRole="EMPLOYEE" />}>
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/employee/apply" element={<ApplyLeave />} />
          <Route path="/employee/leaves" element={<MyLeaves />} />
        </Route>
        <Route element={<ProtectedRoute requiredRole="MANAGER" />}>
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/manager/requests" element={<PendingRequests />} />
          <Route path="/manager/team" element={<TeamPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}