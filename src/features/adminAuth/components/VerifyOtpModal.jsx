import { useRef } from 'react';
import { OTP_LENGTH } from '../constants';
import styles from '../AdminAuthScreen.module.scss';

function VerifyOtpModal({
  otpDigits,
  isVerifyingOtp,
  isResendingOtp,
  canVerifyOtp,
  canResendOtp,
  resendOtpTimerSeconds,
  onOtpDigitChange,
  onOtpKeyDown,
  onVerifyOtp,
  onResendOtp,
  onClose,
}) {
  const inputRefs = useRef([]);
  const formattedResendTimer = `00:${String(resendOtpTimerSeconds).padStart(2, '0')}`;

  const handleChange = (index, value) => {
    onOtpDigitChange(index, value);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    onOtpKeyDown(index, event);
  };

  return (
    <div className={styles.modalOverlay} role="presentation">
      <div className={styles.modalCard} role="dialog" aria-modal="true" aria-label="Verify OTP">
        <h2 className={styles.modalHeading}>Verify OTP</h2>
        <div className={styles.otpRow}>
          {Array.from({ length: OTP_LENGTH }, (_, index) => (
            <input
              key={index}
              className={styles.otpInput}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otpDigits[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              ref={(element) => { inputRefs.current[index] = element; }}
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>
        <div className={styles.otpResendContainer}>
          <span className={styles.otpResendHint}>
            {canResendOtp ? 'Didn\'t receive the code?' : `Resend available in ${formattedResendTimer}`}
          </span>
          <button
            type="button"
            className={styles.otpResendButton}
            onClick={onResendOtp}
            disabled={!canResendOtp}
          >
            {isResendingOtp ? 'Resending...' : 'Resend OTP'}
          </button>
        </div>
        <div className={styles.modalActions}>
          <button type="button" className={styles.secondaryButtonSingle} onClick={onClose}>Cancel</button>
          <button type="button" className={styles.primaryButton} onClick={onVerifyOtp} disabled={!canVerifyOtp || isVerifyingOtp}>
            {isVerifyingOtp ? (
              <span className={styles.buttonContent}>
                <span className={styles.buttonLoader} aria-hidden />
                Verifying...
              </span>
            ) : 'Verify OTP'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtpModal;
