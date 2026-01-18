import api from './axiosInstance';

export async function login(email, password) {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

export async function registerStudent(dto) {
  const res = await api.post('/auth/register-student', dto);
  return res.data;
}
