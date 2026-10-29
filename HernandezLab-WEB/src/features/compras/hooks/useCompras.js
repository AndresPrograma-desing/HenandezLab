import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const SELECT = '*, proveedores(razon_social), empleados(nombre, apellido), detalle_compra(id_detalle_compra)';

const sortByFecha = (list) =>
  [...list].sort((a, b) => new Date(b.fecha_compra) - new Date(a.fecha_compra) || b.created_at.localeCompare(a.created_at));

export const useCompras = (idSucursal) => {
  const [compras, setCompras] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompras = useCallback(async () => {
    if (!idSucursal) {
      setCompras([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('compras_reactivos')
      .select(SELECT)
      .eq('id_sucursal', idSucursal);

    if (fetchError) {
      setError(fetchError);
    } else {
      setCompras(sortByFecha(data ?? []));
    }
    setIsLoading(false);
  }, [idSucursal]);

  useEffect(() => {
    fetchCompras();
  }, [fetchCompras]);

  const createCompra = async ({ id_proveedor, cedula_empleado, numero_factura, fecha_compra, items }) => {
    const monto_total = items.reduce((sum, item) => sum + item.cantidad_comprada * item.costo_unitario, 0);

    const { data: compra, error: insertError } = await supabase
      .from('compras_reactivos')
      .insert({ id_sucursal: idSucursal, id_proveedor, cedula_empleado, numero_factura, fecha_compra, monto_total })
      .select()
      .single();

    if (insertError) throw insertError;

    const detalleRows = items.map((item) => ({ ...item, id_compra: compra.id_compra }));
    const { error: detalleError } = await supabase.from('detalle_compra').insert(detalleRows);

    if (detalleError) throw detalleError;

    const { data: compraCompleta, error: refetchError } = await supabase
      .from('compras_reactivos')
      .select(SELECT)
      .eq('id_compra', compra.id_compra)
      .single();

    if (refetchError) throw refetchError;

    setCompras((prev) => sortByFecha([...prev, compraCompleta]));
    return compraCompleta;
  };

  return {
    compras,
    isLoading,
    error,
    refetch: fetchCompras,
    createCompra,
  };
};
