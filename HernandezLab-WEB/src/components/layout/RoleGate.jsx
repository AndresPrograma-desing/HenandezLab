import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';

export const RoleGate = ({ allowedRoles, children }) => {
  const { empleado } = useAuth();

  if (!empleado) return null;
  if (!allowedRoles.includes(empleado.rol)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  return children;
};
