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

  /**
   * Registra una entrada (compra) o salida de stock para un ítem existente,
   * ajustando stock_actual y, en el caso de una compra, opcionalmente el
   * lote y la fecha de vencimiento.
   */
  const registrarMovimiento = async (item, { tipo, cantidad, lote, fecha_vencimiento }) => {
    const nuevoStock = tipo === 'compra' ? Number(item.stock_actual) + cantidad : Number(item.stock_actual) - cantidad;

    if (nuevoStock < 0) {
      throw new Error('stock_insuficiente');
    }

    const changes = { stock_actual: nuevoStock };
    if (tipo === 'compra') {
      if (lote) changes.lote = lote;
      if (fecha_vencimiento) changes.fecha_vencimiento = fecha_vencimiento;
    }

    return updateItem(item.id_item, changes);
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
