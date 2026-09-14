import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const sortByNombre = (list) => [...list].sort((a, b) => a.nombre.localeCompare(b.nombre));

export const useInventario = (idSucursal) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    if (!idSucursal) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('inventario')
      .select('*, proveedores(razon_social)')
      .eq('id_sucursal', idSucursal);

    if (fetchError) {
      setError(fetchError);
    } else {
      setItems(sortByNombre(data ?? []));
    }
    setIsLoading(false);
  }, [idSucursal]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const createItem = async (values) => {
    const { data, error: insertError } = await supabase
      .from('inventario')
      .insert({ ...values, id_sucursal: idSucursal })
      .select('*, proveedores(razon_social)')
      .single();

    if (insertError) throw insertError;
    setItems((prev) => sortByNombre([...prev, data]));
    return data;
  };

  const updateItem = async (idItem, changes) => {
    const { data, error: updateError } = await supabase
      .from('inventario')
      .update(changes)
      .eq('id_item', idItem)
      .select('*, proveedores(razon_social)')
      .single();

    if (updateError) throw updateError;
    setItems((prev) => sortByNombre(prev.map((item) => (item.id_item === idItem ? data : item))));
    return data;
  };

  const deleteItem = async (idItem) => {
    const { error: deleteError } = await supabase.from('inventario').delete().eq('id_item', idItem);
    if (deleteError) throw deleteError;
    setItems((prev) => prev.filter((item) => item.id_item !== idItem));
  };

  return {
    items,
    isLoading,
    error,
    refetch: fetchItems,
    createItem,
    updateItem,
    deleteItem,
  };
};
