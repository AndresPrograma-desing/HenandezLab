import axiosClient from './axiosClient';

export async function login(email, password) {
  const { data } = await axiosClient.post('/auth/login', { email, password });
  return data;
}

export async function getCurrentUser() {
  const { data } = await axiosClient.get('/auth/me');
  return data;
}
