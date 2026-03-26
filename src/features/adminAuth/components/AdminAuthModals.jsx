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
  isResettingPassword,
  canSendOtp,
  canVerifyOtp,
  canUpdatePassword,
  onForgotFieldChange,
  onSendOtp,
  onOtpDigitChange,
  onOtpKeyDown,
  onVerifyOtp,
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
          canVerifyOtp={canVerifyOtp}
          onOtpDigitChange={onOtpDigitChange}
          onOtpKeyDown={onOtpKeyDown}
          onVerifyOtp={onVerifyOtp}
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
