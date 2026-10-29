import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export const useHistorialLotes = (idItem) => {
  const [lotes, setLotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLotes = useCallback(async () => {
    if (!idItem) {
      setLotes([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('lotes_inventario')
      .select('*, proveedores(razon_social)')
      .eq('id_item', idItem)
      .order('fecha_vencimiento', { ascending: true, nullsFirst: false });

    if (fetchError) {
      setError(fetchError);
    } else {
      setLotes(data ?? []);
    }
    setIsLoading(false);
  }, [idItem]);

  useEffect(() => {
    fetchLotes();
  }, [fetchLotes]);

  return { lotes, isLoading, error, refetch: fetchLotes };
};
