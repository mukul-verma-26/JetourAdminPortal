import styles from '../AdminAuthScreen.module.scss';

function ForgotPasswordModal({
  forgotForm,
  isSendingOtp,
  canSendOtp,
  onFieldChange,
  onSendOtp,
  onClose,
}) {
  return (
    <div className={styles.modalOverlay} role="presentation">
      <div className={styles.modalCard} role="dialog" aria-modal="true" aria-label="Forgot Password">
        <h2 className={styles.modalHeading}>Forgot Password</h2>
        <label className={styles.modalLabel}>Enter your Registred Contact Number</label>
        <div className={styles.contactRow}>
          <input className={styles.countryCode} type="text" value={forgotForm.countryCode} onChange={(e) => onFieldChange('countryCode', e.target.value)} aria-label="Country code" />
          <input className={styles.input} type="text" value={forgotForm.contact} onChange={(e) => onFieldChange('contact', e.target.value)} placeholder="Contact Number" />
        </div>
        <div className={styles.modalActions}>
          <button type="button" className={styles.secondaryButtonSingle} onClick={onClose}>Cancel</button>
          <button type="button" className={styles.primaryButton} onClick={onSendOtp} disabled={!canSendOtp || isSendingOtp}>
            {isSendingOtp ? 'Sending...' : 'Send OTP'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordModal;
