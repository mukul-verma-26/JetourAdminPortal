import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import styles from './PasswordInput.module.scss';

function PasswordInput({
  id,
  label,
  placeholder,
  error,
  errorMessage,
  required = false,
  register,
  name,
  registerOptions = {},
  className = '',
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.inputWrapper}>
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          placeholder={placeholder}
          autoComplete="new-password"
          {...register(name, registerOptions)}
        />
        <button
          type="button"
          className={styles.eyeBtn}
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {showPassword ? (
            <FiEyeOff size={18} className={styles.eyeIcon} />
          ) : (
            <FiEye size={18} className={styles.eyeIcon} />
          )}
        </button>
      </div>
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
    </div>
  );
}

export default PasswordInput;
