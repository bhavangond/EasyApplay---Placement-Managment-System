import api from './axiosInstance';

export async function getJobs() {
  const res = await api.get('/student/jobs');
  return res.data;
}

export async function applyToJob(jobId) {
  const res = await api.post(`/student/apply/${jobId}`);
  return res.data;
}

export async function getProfile() {
  const res = await api.get('/student/profile');
  return res.data;
}

export async function updateProfile(payload) {
  const res = await api.put('/student/profile', payload);
  return res.data;
}

export async function getApplied() {
  const res = await api.get('/student/applied');
  return res.data;
}

export async function uploadResume(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await api.post('/student/upload-resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
}
