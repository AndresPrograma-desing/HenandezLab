import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './useAuth';

const SucursalActivaContext = createContext(undefined);

const STORAGE_KEY = 'hernandezlab_sucursal_activa';

export const SucursalActivaProvider = ({ children }) => {
  const { empleado } = useAuth();
  const [idSucursalActiva, setIdSucursalActiva] = useState(null);

  useEffect(() => {
    if (!empleado) {
      setIdSucursalActiva(null);
      return;
    }

    if (empleado.rol === 'recepcion') {
      setIdSucursalActiva(empleado.id_sucursal);
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    setIdSucursalActiva(stored || empleado.id_sucursal);
  }, [empleado]);

  const cambiarSucursal = useCallback(
    (idSucursal) => {
      if (empleado?.rol !== 'administrativo') return;
      setIdSucursalActiva(idSucursal);
      localStorage.setItem(STORAGE_KEY, idSucursal);
    },
    [empleado]
  );

  const value = useMemo(
    () => ({
      idSucursalActiva,
      cambiarSucursal,
      puedeCambiarSucursal: empleado?.rol === 'administrativo',
    }),
    [idSucursalActiva, empleado, cambiarSucursal]
  );

  return <SucursalActivaContext.Provider value={value}>{children}</SucursalActivaContext.Provider>;
};

export const useSucursalActiva = () => {
  const context = useContext(SucursalActivaContext);
  if (!context) {
    throw new Error('useSucursalActiva debe usarse dentro de un SucursalActivaProvider');
  }
  return context;
};
