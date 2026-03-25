import api from './axios'

export const leaveApi = {
  applyLeave: (data) => api.post('/employee/leaves', data),
  getMyLeaves: (page = 0, size = 10) =>
    api.get(`/employee/leaves?page=${page}&size=${size}`),
  getLeaveById: (id) => api.get(`/employee/leaves/${id}`),
  cancelLeave: (id) => api.delete(`/employee/leaves/${id}`),
  getTeamLeaves: (status, page = 0, size = 10) =>
    api.get(`/manager/leaves?page=${page}&size=${size}${status ? `&status=${status}` : ''}`),
  approveLeave: (id, remarks) => api.patch(`/manager/leaves/${id}/approve`, { remarks }),
  rejectLeave: (id, remarks) => api.patch(`/manager/leaves/${id}/reject`, { remarks }),
  getTeam: () => api.get('/manager/team'),
}

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
}