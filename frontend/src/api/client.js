import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

export const plantsApi = {
  list: () => api.get('/plants/'),
  get: (id) => api.get(`/plants/${id}`),
  create: (data) => api.post('/plants/', data),
  update: (id, data) => api.patch(`/plants/${id}`, data),
  delete: (id) => api.delete(`/plants/${id}`),
  listActive: () => api.get('/plants/active'),
  getDetail: (id) => api.get(`/plants/${id}/detail`),
  applyTemplate: (id) => api.post(`/plants/${id}/apply-template`),
  updateMilestone: (plantId, milestoneId, data) =>
    api.patch(`/plants/${plantId}/milestones/${milestoneId}`, data),
}

export const eventsApi = {
  list: () => api.get('/events/'),
  get: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events/', data),
  update: (id, data) => api.patch(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
}

export const profileApi = {
  get: () => api.get('/profile/'),
  create: (data) => api.post('/profile/', data),
  update: (data) => api.patch('/profile/', data),
}

export const tipsApi = {
  list: () => api.get('/profile/tips/'),
}

export const zonesApi = {
  list: () => api.get('/zones/'),
  timezones: () => api.get('/zones/timezones'),
}

export default api
