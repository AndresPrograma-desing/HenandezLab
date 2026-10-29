import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const sortByNombre = (list) => [...list].sort((a, b) => a.nombre.localeCompare(b.nombre));

const SELECT = '*, lotes_inventario(id_lote, numero_lote, fecha_vencimiento, cantidad_restante, proveedores(razon_social))';

export const pickLoteActual = (lotes = []) =>
  lotes
    .filter((lote) => Number(lote.cantidad_restante) > 0 && lote.fecha_vencimiento)
    .sort((a, b) => new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento))[0] ?? null;

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

    const { data, error: fetchError } = await supabase.from('inventario').select(SELECT).eq('id_sucursal', idSucursal);

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
      .select(SELECT)
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
      .select(SELECT)
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

  /**
   * Registra una salida de stock (merma, uso manual, etc.) para un ítem
   * existente. Las entradas (compras) se registran siempre desde la pantalla
   * de Compras, que además alimenta el historial de lotes (lotes_inventario).
   */
  const registrarMovimiento = async (item, { cantidad }) => {
    const nuevoStock = Number(item.stock_actual) - cantidad;

    if (nuevoStock < 0) {
      throw new Error('stock_insuficiente');
    }

    return updateItem(item.id_item, { stock_actual: nuevoStock });
  };

  return {
    items,
    isLoading,
    error,
    refetch: fetchItems,
    createItem,
    updateItem,
    deleteItem,
    registrarMovimiento,
  };
};
