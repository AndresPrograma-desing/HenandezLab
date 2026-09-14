import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const sortByRazonSocial = (list) => [...list].sort((a, b) => a.razon_social.localeCompare(b.razon_social));

export const useProveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProveedores = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase.from('proveedores').select('*');

    if (fetchError) {
      setError(fetchError);
    } else {
      setProveedores(sortByRazonSocial(data ?? []));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchProveedores();
  }, [fetchProveedores]);

  const createProveedor = async (values) => {
    const { data, error: insertError } = await supabase.from('proveedores').insert(values).select().single();
    if (insertError) throw insertError;
    setProveedores((prev) => sortByRazonSocial([...prev, data]));
    return data;
  };

  const updateProveedor = async (idProveedor, changes) => {
    const { data, error: updateError } = await supabase
      .from('proveedores')
      .update(changes)
      .eq('id_proveedor', idProveedor)
      .select()
      .single();

    if (updateError) throw updateError;
    setProveedores((prev) => sortByRazonSocial(prev.map((p) => (p.id_proveedor === idProveedor ? data : p))));
    return data;
  };

  const deleteProveedor = async (idProveedor) => {
    const { error: deleteError } = await supabase.from('proveedores').delete().eq('id_proveedor', idProveedor);
    if (deleteError) throw deleteError;
    setProveedores((prev) => prev.filter((p) => p.id_proveedor !== idProveedor));
  };

  return {
    proveedores,
    isLoading,
    error,
    refetch: fetchProveedores,
    createProveedor,
    updateProveedor,
    deleteProveedor,
  };
};
