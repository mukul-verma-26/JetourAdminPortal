import ForgotPasswordModal from './ForgotPasswordModal';
import VerifyOtpModal from './VerifyOtpModal';
import ResetPasswordModal from './ResetPasswordModal';

function AdminAuthModals({
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
  onForgotFieldChange,
  onSendOtp,
  onOtpDigitChange,
  onOtpKeyDown,
  onVerifyOtp,
  onResendOtp,
  onResetPasswordFieldChange,
  onUpdatePassword,
  onClose,
}) {
  return (
    <>
      {isForgotPasswordModalOpen && (
        <ForgotPasswordModal
          forgotForm={forgotForm}
          isSendingOtp={isSendingOtp}
          canSendOtp={canSendOtp}
          onFieldChange={onForgotFieldChange}
          onSendOtp={onSendOtp}
          onClose={onClose}
        />
      )}
      {isVerifyOtpModalOpen && (
        <VerifyOtpModal
          otpDigits={otpDigits}
          isVerifyingOtp={isVerifyingOtp}
          isResendingOtp={isResendingOtp}
          canVerifyOtp={canVerifyOtp}
          canResendOtp={canResendOtp}
          resendOtpTimerSeconds={resendOtpTimerSeconds}
          onOtpDigitChange={onOtpDigitChange}
          onOtpKeyDown={onOtpKeyDown}
          onVerifyOtp={onVerifyOtp}
          onResendOtp={onResendOtp}
          onClose={onClose}
        />
      )}
      {isResetPasswordModalOpen && (
        <ResetPasswordModal
          resetForm={resetPasswordForm}
          isResettingPassword={isResettingPassword}
          canUpdatePassword={canUpdatePassword}
          onFieldChange={onResetPasswordFieldChange}
          onUpdatePassword={onUpdatePassword}
          onClose={onClose}
        />
      )}
    </>
  );
}

export default AdminAuthModals;
