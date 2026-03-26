import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAdminAuthSession } from '../helpers/authStorage';

export function useAdminSession() {
  const navigate = useNavigate();

  const logout = useCallback(() => {
    clearAdminAuthSession();
    navigate('/', { replace: true });
    if (typeof window?.showToast === 'function') {
      window.showToast('Logged out successfully', 'success');
    }
  }, [navigate]);

  return { logout };
}
