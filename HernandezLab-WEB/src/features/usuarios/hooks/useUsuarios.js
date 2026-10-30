import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const sortByNombre = (list) =>
  [...list].sort((a, b) => `${a.nombre} ${a.apellido}`.localeCompare(`${b.nombre} ${b.apellido}`));

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
    const { data, error: invokeError } = await supabase.functions.invoke('crear-empleado', { body: values });

    if (invokeError) {
      const serverMessage = await invokeError.context?.json?.().catch(() => null);
      throw new Error(serverMessage?.error || invokeError.message);
    }
    if (data?.error) throw new Error(data.error);

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
    const { data, error: invokeError } = await supabase.functions.invoke('eliminar-empleado', { body: { cedula } });

    if (invokeError) {
      const serverMessage = await invokeError.context?.json?.().catch(() => null);
      throw new Error(serverMessage?.error || invokeError.message);
    }
    if (data?.error) throw new Error(data.error);

    setUsuarios((prev) => prev.filter((u) => u.cedula !== cedula));
  };

  return {
    usuarios,
    isLoading,
    error,
    refetch: fetchUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
  };
};
