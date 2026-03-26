import axios from 'axios';

const REGISTER_ADMIN_URL = 'https://jetour-1.onrender.com/api/v1/admin/register';
const LOGIN_ADMIN_URL = 'https://jetour-1.onrender.com/api/v1/admin/login';
const FORGOT_PASSWORD_URL = 'https://jetour-1.onrender.com/api/v1/admin/forgot-password';
const VERIFY_OTP_URL = 'https://jetour-1.onrender.com/api/v1/admin/verify-otp';
const RESET_PASSWORD_URL = 'https://jetour-1.onrender.com/api/v1/admin/reset-password';

export async function registerAdmin(payload) {
  try {
    const { data } = await axios.post(REGISTER_ADMIN_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return data;
  } catch (error) {
    console.log('registerAdmin', `POST ${REGISTER_ADMIN_URL}`, 'Error:', error);
    console.log('registerAdmin', 'Error response:', error?.response?.data);
    console.log('registerAdmin', 'Error message:', error?.message);
    throw error;
  }
}

export async function loginAdmin(payload) {
  try {
    const { data } = await axios.post(LOGIN_ADMIN_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return data;
  } catch (error) {
    console.log('loginAdmin', `POST ${LOGIN_ADMIN_URL}`, 'Error:', error);
    console.log('loginAdmin', 'Error response:', error?.response?.data);
    console.log('loginAdmin', 'Error message:', error?.message);
    throw error;
  }
}

export async function forgotPasswordAdmin(payload) {
  try {
    const { data } = await axios.post(FORGOT_PASSWORD_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return data;
  } catch (error) {
    console.log('forgotPasswordAdmin', `POST ${FORGOT_PASSWORD_URL}`, 'Error:', error);
    console.log('forgotPasswordAdmin', 'Error response:', error?.response?.data);
    console.log('forgotPasswordAdmin', 'Error message:', error?.message);
    throw error;
  }
}

export async function verifyAdminOtp(payload) {
  try {
    const { data } = await axios.post(VERIFY_OTP_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return data;
  } catch (error) {
    console.log('verifyAdminOtp', `POST ${VERIFY_OTP_URL}`, 'Error:', error);
    console.log('verifyAdminOtp', 'Error response:', error?.response?.data);
    console.log('verifyAdminOtp', 'Error message:', error?.message);
    throw error;
  }
}

export async function resetAdminPassword(payload) {
  try {
    const { data } = await axios.post(RESET_PASSWORD_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return data;
  } catch (error) {
    console.log('resetAdminPassword', `POST ${RESET_PASSWORD_URL}`, 'Error:', error);
    console.log('resetAdminPassword', 'Error response:', error?.response?.data);
    console.log('resetAdminPassword', 'Error message:', error?.message);
    throw error;
  }
}
