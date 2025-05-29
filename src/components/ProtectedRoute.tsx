import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import toast from 'react-hot-toast';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, checkAuth } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error('Auth verification error:', error);
        toast.error('Error al verificar la autenticación');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAuth();
  }, [checkAuth]);

  if (loading || isVerifying) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login\" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}