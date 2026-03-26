import styles from '../AdminAuthScreen.module.scss';

function ResetPasswordModal({
  resetForm,
  isResettingPassword,
  canUpdatePassword,
  onFieldChange,
  onUpdatePassword,
  onClose,
}) {
  return (
    <div className={styles.modalOverlay} role="presentation">
      <div className={styles.modalCard} role="dialog" aria-modal="true" aria-label="Reset Password">
        <h2 className={styles.modalHeading}>Reset Password</h2>
        <input className={styles.input} type="password" value={resetForm.password} onChange={(e) => onFieldChange('password', e.target.value)} placeholder="Enter Password" />
        <input className={styles.input} type="password" value={resetForm.confirmPassword} onChange={(e) => onFieldChange('confirmPassword', e.target.value)} placeholder="Confirm Password" />
        <div className={styles.modalActions}>
          <button type="button" className={styles.secondaryButtonSingle} onClick={onClose}>Cancel</button>
          <button type="button" className={styles.primaryButton} onClick={onUpdatePassword} disabled={!canUpdatePassword || isResettingPassword}>
            {isResettingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordModal;
