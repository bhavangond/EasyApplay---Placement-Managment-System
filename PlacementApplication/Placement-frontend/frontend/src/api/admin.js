import api from './axiosInstance';

export async function getAllJobs() {
  const res = await api.get('/admin/jobs');
  return res.data;
}

export async function getOpenJobs() {
  const res = await api.get('/admin/jobs/open');
  return res.data;
}

export async function createJob(job) {
  const res = await api.post('/admin/job', job);
  return res.data;
}

export async function uploadJD(jobId, file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await api.post(`/admin/job/${jobId}/upload-jd`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
}

export async function getAllApplications() {
  const res = await api.get('/admin');
  return res.data;
}

export async function updateApplicationStatus(applicationId, status) {
  const res = await api.put(`/admin/${applicationId}/status`, null, { params: { status } });
  return res.data;
}

export async function deleteJob(jobId) {
  const res = await api.delete(`/admin/job/${jobId}`);
  return res.data;
}


export async function updateJob(jobId, jobData) {
  const res = await api.put(`/admin/job/${jobId}`, jobData);
  return res.data;
}

export async function getAllStudents() {
  const res = await api.get('/admin/students');
  return res.data;
}

