import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { TEXTS } from '../../constants/texts';
import { useAuth } from '../../hooks/useAuth';
import Loading from 'anteriority-ui/screens/components/Loading/index';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loading text={TEXTS.auth.loadingSession} />;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  return children;
};
