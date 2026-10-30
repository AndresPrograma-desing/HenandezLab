import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const sortByNombre = (list) =>
  [...list].sort((a, b) => `${a.nombre} ${a.apellido}`.localeCompare(`${b.nombre} ${b.apellido}`));

const invokeFunction = async (name, body) => {
  const { data, error: invokeError } = await supabase.functions.invoke(name, { body });

  if (invokeError) {
    const serverMessage = await invokeError.context?.json?.().catch(() => null);
    throw new Error(serverMessage?.error || invokeError.message);
  }
  if (data?.error) throw new Error(data.error);

  return data;
};

export const useUsuarios = (idSucursal) => {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsuarios = useCallback(async () => {
    if (!idSucursal) {
      setUsuarios([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('empleados')
      .select('*, sucursales(nombre)')
      .eq('id_sucursal', idSucursal);

    if (fetchError) {
      setError(fetchError);
    } else {
      setUsuarios(sortByNombre(data ?? []));
    }
    setIsLoading(false);
  }, [idSucursal]);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const createUsuario = async (values) => {
    const data = await invokeFunction('crear-empleado', values);
    await fetchUsuarios();
    return data.empleado;
  };

  const updateUsuario = async (cedula, changes) => {
    const { data, error: updateError } = await supabase
      .from('empleados')
      .update(changes)
      .eq('cedula', cedula)
      .select('*, sucursales(nombre)')
      .single();

    if (updateError) throw updateError;
    setUsuarios((prev) => sortByNombre(prev.map((u) => (u.cedula === cedula ? data : u))));
    return data;
  };

  const deleteUsuario = async (cedula) => {
    await invokeFunction('eliminar-empleado', { cedula });
    setUsuarios((prev) => prev.filter((u) => u.cedula !== cedula));
  };

  const resetearPassword = async (cedula, password) => {
    await invokeFunction('resetear-password-empleado', { cedula, password });
  };

  return {
    usuarios,
    isLoading,
    error,
    refetch: fetchUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    resetearPassword,
  };
};
