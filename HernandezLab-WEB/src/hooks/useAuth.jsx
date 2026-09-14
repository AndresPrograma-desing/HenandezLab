import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { TEXTS } from '../constants/texts';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [empleado, setEmpleado] = useState(null);
  const [empleadoError, setEmpleadoError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEmpleado = useCallback(async (authUserId) => {
    if (!authUserId) {
      setEmpleado(null);
      setEmpleadoError(null);
      return;
    }

    const { data, error } = await supabase
      .from('empleados')
      .select('cedula, nombre, apellido, cargo, rol, id_sucursal, estado_activo')
      .eq('auth_user_id', authUserId)
      .maybeSingle();

    if (error || !data) {
      setEmpleado(null);
      setEmpleadoError(TEXTS.auth.errors.sinEmpleadoVinculado);
      await supabase.auth.signOut();
      return;
    }

    setEmpleadoError(null);
    setEmpleado(data);
  }, []);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      await fetchEmpleado(data.session?.user?.id);
      if (active) setIsLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!active) return;
      setIsLoading(true);
      setSession(nextSession);
      await fetchEmpleado(nextSession?.user?.id);
      if (active) setIsLoading(false);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [fetchEmpleado]);

  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });
  const signOut = () => supabase.auth.signOut();

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      empleado,
      empleadoError,
      isAuthenticated: Boolean(session) && Boolean(empleado),
      isLoading,
      signIn,
      signOut,
    }),
    [session, empleado, empleadoError, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
