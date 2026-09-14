import { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, Boxes, Users, Building2, Truck, LogOut } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { TEXTS } from '../../../constants/texts';
import { useAuth } from '../../../hooks/useAuth';
import { SucursalSelector } from '../SucursalSelector';
import ProSidebar from 'anteriority-ui/screens/components/Sidebar/index';
import styles from './index.module.css';

const buildGroups = (rol) => {
  const principal = {
    title: TEXTS.layout.sidebarGroupPrincipal,
    items: [
      { id: ROUTES.DASHBOARD, label: TEXTS.layout.nav.dashboard, icon: Home },
      { id: ROUTES.SOLICITUDES, label: TEXTS.layout.nav.solicitudes, icon: ClipboardList },
      { id: ROUTES.INVENTARIO, label: TEXTS.layout.nav.inventario, icon: Boxes },
    ],
  };

  if (rol !== 'administrativo') return [principal];

  const administracion = {
    title: TEXTS.layout.sidebarGroupAdministracion,
    items: [
      { id: ROUTES.USUARIOS, label: TEXTS.layout.nav.usuarios, icon: Users },
      { id: ROUTES.SUCURSALES, label: TEXTS.layout.nav.sucursales, icon: Building2 },
      { id: ROUTES.PROVEEDORES, label: TEXTS.layout.nav.proveedores, icon: Truck },
    ],
  };

  return [principal, administracion];
};

export const DashboardLayout = () => {
  const { empleado, user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const groups = useMemo(() => buildGroups(empleado?.rol), [empleado?.rol]);

  const userMenuItems = useMemo(
    () => [{ id: 'logout', label: TEXTS.auth.logout, icon: LogOut, onClick: signOut }],
    [signOut]
  );

  return (
    <div className={styles.layout}>
      <ProSidebar
        groups={groups}
        activeId={location.pathname}
        onSelect={(item) => navigate(item.id)}
        headerContent={<span className={styles.brand}>{TEXTS.app.name}</span>}
        user={user}
        userMenuItems={userMenuItems}
      />
      <div className={styles.main}>
        <div className={styles.topbar}>
          <SucursalSelector />
        </div>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
