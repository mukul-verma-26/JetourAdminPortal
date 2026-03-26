import styles from '../AdminAuthScreen.module.scss';

function AdminAuthForm({
  isLoginMode,
  loginForm,
  registerForm,
  onLoginFieldChange,
  onRegisterFieldChange,
  onLogin,
  onRegister,
  isLoggingIn,
  isRegistering,
  onForgotPassword,
  onSwitchToLogin,
  onSwitchToRegister,
}) {
  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <h1 className={styles.heading}>{isLoginMode ? 'Admin Login' : 'Register Admin'}</h1>

        {isLoginMode ? (
          <>
            <input className={styles.input} type="text" placeholder="Username" value={loginForm.username} onChange={(e) => onLoginFieldChange('username', e.target.value)} />
            <input className={styles.input} type="password" placeholder="Password" value={loginForm.password} onChange={(e) => onLoginFieldChange('password', e.target.value)} />
            <button type="button" className={styles.primaryButton} onClick={onLogin} disabled={isLoggingIn}>
              {isLoggingIn ? (
                <span className={styles.buttonContent}>
                  <span className={styles.buttonLoader} aria-hidden />
                  Logging in...
                </span>
              ) : 'Login'}
            </button>
            <div className={styles.secondaryActions}>
              <button type="button" className={styles.secondaryButton} onClick={onSwitchToRegister}>Register</button>
              <button type="button" className={styles.secondaryButton} onClick={onForgotPassword}>Forgot Password</button>
            </div>
          </>
        ) : (
          <>
            <input className={styles.input} type="text" placeholder="Username" value={registerForm.username} onChange={(e) => onRegisterFieldChange('username', e.target.value)} />
            <div className={styles.contactRow}>
              <input className={styles.countryCode} type="text" value={registerForm.countryCode} onChange={(e) => onRegisterFieldChange('countryCode', e.target.value)} aria-label="Country code" />
              <input className={styles.input} type="text" placeholder="Contact" value={registerForm.contact} onChange={(e) => onRegisterFieldChange('contact', e.target.value)} />
            </div>
            <input className={styles.input} type="password" placeholder="Password" value={registerForm.password} onChange={(e) => onRegisterFieldChange('password', e.target.value)} />
            <button type="button" className={styles.primaryButton} onClick={onRegister} disabled={isRegistering}>
              {isRegistering ? (
                <span className={styles.buttonContent}>
                  <span className={styles.buttonLoader} aria-hidden />
                  Registering...
                </span>
              ) : 'Register'}
            </button>
            <button type="button" className={styles.secondaryButtonSingle} onClick={onSwitchToLogin}>Login</button>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminAuthForm;
