import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const sortByNombre = (list) =>
  [...list].sort((a, b) => `${a.nombre} ${a.apellido}`.localeCompare(`${b.nombre} ${b.apellido}`));

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsuarios = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('empleados')
      .select('*, sucursales(nombre)');

    if (fetchError) {
      setError(fetchError);
    } else {
      setUsuarios(sortByNombre(data ?? []));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const createUsuario = async (values) => {
    const { data, error: insertError } = await supabase
      .from('empleados')
      .insert(values)
      .select('*, sucursales(nombre)')
      .single();

    if (insertError) throw insertError;
    setUsuarios((prev) => sortByNombre([...prev, data]));
    return data;
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
    const { error: deleteError } = await supabase.from('empleados').delete().eq('cedula', cedula);
    if (deleteError) throw deleteError;
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
