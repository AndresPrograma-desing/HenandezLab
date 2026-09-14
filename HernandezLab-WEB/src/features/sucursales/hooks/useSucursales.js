import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export const useSucursales = () => {
  const [sucursales, setSucursales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSucursales = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('sucursales')
      .select('*')
      .order('nombre', { ascending: true });

    if (fetchError) {
      setError(fetchError);
    } else {
      setSucursales(data ?? []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchSucursales();
  }, [fetchSucursales]);

  const createSucursal = async (values) => {
    const { data, error: insertError } = await supabase
      .from('sucursales')
      .insert(values)
      .select()
      .single();

    if (insertError) throw insertError;
    setSucursales((prev) => [...prev, data].sort((a, b) => a.nombre.localeCompare(b.nombre)));
    return data;
  };

  const updateSucursal = async (idSucursal, changes) => {
    const { data, error: updateError } = await supabase
      .from('sucursales')
      .update(changes)
      .eq('id_sucursal', idSucursal)
      .select()
      .single();

    if (updateError) throw updateError;
    setSucursales((prev) => prev.map((s) => (s.id_sucursal === idSucursal ? data : s)));
    return data;
  };

  const deleteSucursal = async (idSucursal) => {
    const { error: deleteError } = await supabase.from('sucursales').delete().eq('id_sucursal', idSucursal);
    if (deleteError) throw deleteError;
    setSucursales((prev) => prev.filter((s) => s.id_sucursal !== idSucursal));
  };

  return {
    sucursales,
    isLoading,
    error,
    refetch: fetchSucursales,
    createSucursal,
    updateSucursal,
    deleteSucursal,
  };
};
