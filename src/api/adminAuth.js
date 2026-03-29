import { apiClient } from './client.js';

export async function registerAdmin(payload) {
  const path = '/admin/register';
  try {
    const { data } = await apiClient.post(path, payload);
    return data;
  } catch (error) {
    console.log('registerAdmin', `POST ${path}`, 'Error:', error);
    console.log('registerAdmin', 'Error response:', error?.response?.data);
    console.log('registerAdmin', 'Error message:', error?.message);
    throw error;
  }
}

export async function loginAdmin(payload) {
  const path = '/admin/login';
  try {
    const { data } = await apiClient.post(path, payload);
    return data;
  } catch (error) {
    console.log('loginAdmin', `POST ${path}`, 'Error:', error);
    console.log('loginAdmin', 'Error response:', error?.response?.data);
    console.log('loginAdmin', 'Error message:', error?.message);
    throw error;
  }
}

export async function forgotPasswordAdmin(payload) {
  const path = '/admin/forgot-password';
  try {
    const { data } = await apiClient.post(path, payload);
    return data;
  } catch (error) {
    console.log('forgotPasswordAdmin', `POST ${path}`, 'Error:', error);
    console.log('forgotPasswordAdmin', 'Error response:', error?.response?.data);
    console.log('forgotPasswordAdmin', 'Error message:', error?.message);
    throw error;
  }
}

export async function verifyAdminOtp(payload) {
  const path = '/admin/verify-otp';
  try {
    const { data } = await apiClient.post(path, payload);
    return data;
  } catch (error) {
    console.log('verifyAdminOtp', `POST ${path}`, 'Error:', error);
    console.log('verifyAdminOtp', 'Error response:', error?.response?.data);
    console.log('verifyAdminOtp', 'Error message:', error?.message);
    throw error;
  }
}

export async function resetAdminPassword(payload) {
  const path = '/admin/reset-password';
  try {
    const { data } = await apiClient.post(path, payload);
    return data;
  } catch (error) {
    console.log('resetAdminPassword', `POST ${path}`, 'Error:', error);
    console.log('resetAdminPassword', 'Error response:', error?.response?.data);
    console.log('resetAdminPassword', 'Error message:', error?.message);
    throw error;
  }
}
