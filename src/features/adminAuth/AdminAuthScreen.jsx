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
    isResendingOtp,
    isResettingPassword,
    canSendOtp,
    canVerifyOtp,
    canResendOtp,
    canUpdatePassword,
    resendOtpTimerSeconds,
    login,
    register,
    forgotPassword,
    sendOtp,
    updateOtpDigit,
    clearOtpDigit,
    verifyOtp,
    resendOtp,
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
        isResendingOtp={isResendingOtp}
        isResettingPassword={isResettingPassword}
        canSendOtp={canSendOtp}
        canVerifyOtp={canVerifyOtp}
        canResendOtp={canResendOtp}
        canUpdatePassword={canUpdatePassword}
        resendOtpTimerSeconds={resendOtpTimerSeconds}
        onForgotFieldChange={updateForgotField}
        onSendOtp={sendOtp}
        onOtpDigitChange={handleOtpDigitChange}
        onOtpKeyDown={handleOtpKeyDown}
        onVerifyOtp={verifyOtp}
        onResendOtp={resendOtp}
        onResetPasswordFieldChange={updateResetPasswordField}
        onUpdatePassword={updatePassword}
        onClose={closeForgotPasswordFlow}
      />
    </>
  );
}

export default AdminAuthScreen;
