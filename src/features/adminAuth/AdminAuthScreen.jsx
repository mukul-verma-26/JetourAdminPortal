import AdminAuthForm from './components/AdminAuthForm';
import AdminAuthModals from './components/AdminAuthModals';
import { useAdminAuth } from './hooks/useAdminAuth';

function AdminAuthScreen() {
  const {
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
    login,
    register,
    forgotPassword,
    sendOtp,
    updateOtpDigit,
    clearOtpDigit,
    verifyOtp,
    updatePassword,
    closeForgotPasswordFlow,
  } = useAdminAuth();

  const handleOtpDigitChange = (index, value) => {
    updateOtpDigit(index, value);
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      clearOtpDigit(index - 1);
    }
  };

  return (
    <>
      <AdminAuthForm
        isLoginMode={isLoginMode}
        loginForm={loginForm}
        registerForm={registerForm}
        onLoginFieldChange={updateLoginField}
        onRegisterFieldChange={updateRegisterField}
        onLogin={login}
        onRegister={register}
        isLoggingIn={isLoggingIn}
        isRegistering={isRegistering}
        onForgotPassword={forgotPassword}
        onSwitchToLogin={switchToLogin}
        onSwitchToRegister={switchToRegister}
      />

      <AdminAuthModals
        isForgotPasswordModalOpen={isForgotPasswordModalOpen}
        isVerifyOtpModalOpen={isVerifyOtpModalOpen}
        isResetPasswordModalOpen={isResetPasswordModalOpen}
        forgotForm={forgotForm}
        otpDigits={otpDigits}
        resetPasswordForm={resetPasswordForm}
        isSendingOtp={isSendingOtp}
        isVerifyingOtp={isVerifyingOtp}
        isResettingPassword={isResettingPassword}
        canSendOtp={canSendOtp}
        canVerifyOtp={canVerifyOtp}
        canUpdatePassword={canUpdatePassword}
        onForgotFieldChange={updateForgotField}
        onSendOtp={sendOtp}
        onOtpDigitChange={handleOtpDigitChange}
        onOtpKeyDown={handleOtpKeyDown}
        onVerifyOtp={verifyOtp}
        onResetPasswordFieldChange={updateResetPasswordField}
        onUpdatePassword={updatePassword}
        onClose={closeForgotPasswordFlow}
      />
    </>
  );
}

export default AdminAuthScreen;
