import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  forgotPasswordAdmin,
  loginAdmin,
  registerAdmin,
  resetAdminPassword,
  verifyAdminOtp,
} from '../../../api/adminAuth';
import { saveAdminAuthToken } from '../helpers/authStorage';
import { AUTH_FORM_MODE, DEFAULT_COUNTRY_CODE, OTP_LENGTH } from '../constants';

const INITIAL_LOGIN_FORM = {
  username: '',
  password: '',
};

const INITIAL_REGISTER_FORM = {
  username: '',
  countryCode: DEFAULT_COUNTRY_CODE,
  contact: '',
  password: '',
};
const INITIAL_FORGOT_FORM = {
  countryCode: DEFAULT_COUNTRY_CODE,
  contact: '',
};
const INITIAL_RESET_PASSWORD_FORM = {
  password: '',
  confirmPassword: '',
};
const INITIAL_OTP_DIGITS = Array(OTP_LENGTH).fill('');

function normalizeCountryCode(value) {
  const trimmedValue = value.replace(/\s+/g, '');
  if (!trimmedValue) return DEFAULT_COUNTRY_CODE;
  if (trimmedValue.startsWith(DEFAULT_COUNTRY_CODE)) return trimmedValue;
  return `${DEFAULT_COUNTRY_CODE}${trimmedValue.replace(/\+/g, '')}`;
}

export function useAdminAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState(AUTH_FORM_MODE.LOGIN);
  const [loginForm, setLoginForm] = useState(INITIAL_LOGIN_FORM);
  const [registerForm, setRegisterForm] = useState(INITIAL_REGISTER_FORM);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [isVerifyOtpModalOpen, setIsVerifyOtpModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [forgotForm, setForgotForm] = useState(INITIAL_FORGOT_FORM);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpDigits, setOtpDigits] = useState(INITIAL_OTP_DIGITS);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [verifiedContact, setVerifiedContact] = useState('');
  const [resetPasswordForm, setResetPasswordForm] = useState(INITIAL_RESET_PASSWORD_FORM);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const isLoginMode = mode === AUTH_FORM_MODE.LOGIN;

  const switchToLogin = () => setMode(AUTH_FORM_MODE.LOGIN);
  const switchToRegister = () => setMode(AUTH_FORM_MODE.REGISTER);

  const updateLoginField = (field, value) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateRegisterField = (field, value) => {
    if (field === 'countryCode') {
      setRegisterForm((prev) => ({ ...prev, countryCode: normalizeCountryCode(value) }));
      return;
    }

    setRegisterForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateForgotField = (field, value) => {
    if (field === 'countryCode') {
      setForgotForm((prev) => ({ ...prev, countryCode: normalizeCountryCode(value) }));
      return;
    }
    setForgotForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateResetPasswordField = (field, value) => {
    setResetPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const closeForgotPasswordFlow = () => {
    setIsForgotPasswordModalOpen(false);
    setIsVerifyOtpModalOpen(false);
    setIsResetPasswordModalOpen(false);
    setForgotForm(INITIAL_FORGOT_FORM);
    setOtpDigits(INITIAL_OTP_DIGITS);
    setResetPasswordForm(INITIAL_RESET_PASSWORD_FORM);
    setVerifiedContact('');
  };

  const actionHandlers = useMemo(() => ({
    login: async () => {
      try {
        setIsLoggingIn(true);
        const response = await loginAdmin({
          username: loginForm.username.trim(),
          password: loginForm.password,
        });

        if (response?.success && response?.token) {
          saveAdminAuthToken(response.token);
          navigate('/admin', { replace: true });
          if (typeof window?.showToast === 'function') {
            window.showToast('Login successful', 'success');
          }
        }
      } catch (error) {
        console.log('useAdminAuth.login', 'loginAdmin', error);
        if (typeof window?.showToast === 'function') {
          window.showToast(error?.response?.data?.message || 'Login failed', 'error');
        }
      } finally {
        setIsLoggingIn(false);
      }
    },
    register: async () => {
      try {
        setIsRegistering(true);
        const response = await registerAdmin({
          username: registerForm.username.trim(),
          country_code: registerForm.countryCode.trim(),
          contact: registerForm.contact.trim(),
          password: registerForm.password,
        });

        if (response?.success) {
          setMode(AUTH_FORM_MODE.LOGIN);
          navigate('/', { replace: true });
          if (typeof window?.showToast === 'function') {
            window.showToast('Registration successful. Please login.', 'success');
          }
        }
      } catch (error) {
        console.log('useAdminAuth.register', 'registerAdmin', error);
        if (typeof window?.showToast === 'function') {
          window.showToast(error?.response?.data?.message || 'Registration failed', 'error');
        }
      } finally {
        setIsRegistering(false);
      }
    },
    forgotPassword: () => setIsForgotPasswordModalOpen(true),
    sendOtp: async () => {
      try {
        setIsSendingOtp(true);
        const response = await forgotPasswordAdmin({
          contact: forgotForm.contact.trim(),
          country_code: forgotForm.countryCode.trim(),
        });
        if (response?.success) {
          if (typeof window?.showToast === 'function') {
            window.showToast(response?.message || 'OTP sent to your registered number', 'success');
          }
          setIsForgotPasswordModalOpen(false);
          setIsVerifyOtpModalOpen(true);
        }
      } catch (error) {
        console.log('useAdminAuth.sendOtp', 'forgotPasswordAdmin', error);
        if (typeof window?.showToast === 'function') {
          window.showToast(error?.response?.data?.message || 'Failed to send OTP', 'error');
        }
      } finally {
        setIsSendingOtp(false);
      }
    },
    updateOtpDigit: (index, rawValue) => {
      const value = rawValue.replace(/\D/g, '').slice(-1);
      setOtpDigits((prev) => {
        const next = [...prev];
        next[index] = value;
        return next;
      });
    },
    clearOtpDigit: (index) => {
      setOtpDigits((prev) => {
        const next = [...prev];
        next[index] = '';
        return next;
      });
    },
    verifyOtp: async () => {
      try {
        setIsVerifyingOtp(true);
        const response = await verifyAdminOtp({
          contact: forgotForm.contact.trim(),
          otp: otpDigits.join(''),
        });
        if (response?.success) {
          setVerifiedContact(forgotForm.contact.trim());
          setIsVerifyOtpModalOpen(false);
          setIsResetPasswordModalOpen(true);
          if (typeof window?.showToast === 'function') {
            window.showToast('OTP verified', 'success');
          }
        }
      } catch (error) {
        console.log('useAdminAuth.verifyOtp', 'verifyAdminOtp', error);
        if (typeof window?.showToast === 'function') {
          window.showToast(error?.response?.data?.message || 'OTP verification failed', 'error');
        }
      } finally {
        setIsVerifyingOtp(false);
      }
    },
    updatePassword: async () => {
      try {
        setIsResettingPassword(true);
        const response = await resetAdminPassword({
          contact: verifiedContact,
          newPassword: resetPasswordForm.password,
        });
        if (response?.success) {
          closeForgotPasswordFlow();
          setMode(AUTH_FORM_MODE.LOGIN);
          navigate('/', { replace: true });
          if (typeof window?.showToast === 'function') {
            window.showToast('Password Updated successfully', 'success');
          }
        }
      } catch (error) {
        console.log('useAdminAuth.updatePassword', 'resetAdminPassword', error);
        if (typeof window?.showToast === 'function') {
          window.showToast(error?.response?.data?.message || 'Failed to update password', 'error');
        }
      } finally {
        setIsResettingPassword(false);
      }
    },
    closeForgotPasswordFlow,
  }), [forgotForm, loginForm, navigate, otpDigits, registerForm, resetPasswordForm, verifiedContact]);

  const canSendOtp = Boolean(forgotForm.countryCode.trim() && forgotForm.contact.trim());
  const canVerifyOtp = otpDigits.every((digit) => Boolean(digit));
  const canUpdatePassword = Boolean(
    resetPasswordForm.password &&
    resetPasswordForm.confirmPassword &&
    resetPasswordForm.password === resetPasswordForm.confirmPassword
  );

  return {
    isLoginMode,
    loginForm,
    registerForm,
    switchToLogin,
    switchToRegister,
    updateLoginField,
    updateRegisterField,
    updateForgotField,
    updateResetPasswordField,
    isLoggingIn,
    isRegistering,
    isForgotPasswordModalOpen,
    isVerifyOtpModalOpen,
    isResetPasswordModalOpen,
    forgotForm,
    otpDigits,
    resetPasswordForm,
    isSendingOtp,
    isVerifyingOtp,
    isResettingPassword,
    canSendOtp,
    canVerifyOtp,
    canUpdatePassword,
    ...actionHandlers,
  };
}
