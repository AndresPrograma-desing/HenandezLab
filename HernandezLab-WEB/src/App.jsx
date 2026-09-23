import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { theme } from './styles/theme';
import { ROUTES } from './constants/routes';
import { AuthProvider } from './hooks/useAuth';
import { SucursalActivaProvider } from './hooks/useSucursalActiva';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { RoleGate } from './components/layout/RoleGate';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LoginPage } from './features/auth/LoginPage';
import { DashboardPage } from './features/dashboard';
import { UsuariosPage } from './features/usuarios';
import { SucursalesPage } from './features/sucursales';
import { InventarioPage } from './features/inventario';
import { SolicitudesPage } from './features/solicitudes';
import { ProveedoresPage } from './features/proveedores';
import { PreciosPage } from './features/precios';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <SucursalActivaProvider>
            <Routes>
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                <Route path={ROUTES.SOLICITUDES} element={<SolicitudesPage />} />
                <Route path={ROUTES.INVENTARIO} element={<InventarioPage />} />
                <Route
                  path={ROUTES.USUARIOS}
                  element={
                    <RoleGate allowedRoles={['administrativo']}>
                      <UsuariosPage />
                    </RoleGate>
                  }
                />
                <Route
                  path={ROUTES.SUCURSALES}
                  element={
                    <RoleGate allowedRoles={['administrativo']}>
                      <SucursalesPage />
                    </RoleGate>
                  }
                />
                <Route
                  path={ROUTES.PROVEEDORES}
                  element={
                    <RoleGate allowedRoles={['administrativo']}>
                      <ProveedoresPage />
                    </RoleGate>
                  }
                />
                <Route
                  path={ROUTES.PRECIOS}
                  element={
                    <RoleGate allowedRoles={['administrativo']}>
                      <PreciosPage />
                    </RoleGate>
                  }
                />
              </Route>
              <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            </Routes>
          </SucursalActivaProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
