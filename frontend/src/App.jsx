import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Inventory from './pages/Inventory';
import Vacations from './pages/Vacations';
import Payroll from './pages/Payroll';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Dashboard />} handle={{ title: 'Resumen' }} />
            <Route path="empleados" element={<Employees />} handle={{ title: 'Empleados' }} />
            <Route path="inventario" element={<Inventory />} handle={{ title: 'Inventario' }} />
            <Route path="vacaciones" element={<Vacations />} handle={{ title: 'Vacaciones' }} />
            <Route path="nomina" element={<Payroll />} handle={{ title: 'Nómina' }} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
