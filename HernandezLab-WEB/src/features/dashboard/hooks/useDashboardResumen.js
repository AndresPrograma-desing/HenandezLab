import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { DIAS_ALERTA_VENCIMIENTO } from '../../../utils/vencimiento';

const emptyResumen = {
  solicitudesPendientes: 0,
  totalInventario: 0,
  stockBajo: 0,
  porVencer: 0,
  usuariosActivos: null,
  sucursalesActivas: null,
};

/**
 * Agrega los conteos clave de la sucursal activa (y, para el rol
 * administrativo, del sistema completo) que se muestran en el dashboard.
 */
export const useDashboardResumen = (idSucursalActiva, { esAdministrativo = false } = {}) => {
  const [resumen, setResumen] = useState(emptyResumen);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResumen = useCallback(async () => {
    if (!idSucursalActiva) {
      setResumen(emptyResumen);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const limiteVencimiento = new Date();
      limiteVencimiento.setDate(limiteVencimiento.getDate() + DIAS_ALERTA_VENCIMIENTO);
      const limiteVencimientoStr = limiteVencimiento.toISOString().slice(0, 10);

      const [solicitudesPendientesRes, inventarioRes, adminRes] = await Promise.all([
        supabase
          .from('solicitudes')
          .select('id_solicitud', { count: 'exact', head: true })
          .eq('id_sucursal', idSucursalActiva)
          .eq('estado', 'pendiente'),
        supabase
          .from('inventario')
          .select('stock_actual, stock_minimo, fecha_vencimiento')
          .eq('id_sucursal', idSucursalActiva),
        esAdministrativo
          ? Promise.all([
              supabase.from('empleados').select('cedula', { count: 'exact', head: true }).eq('estado_activo', true),
              supabase.from('sucursales').select('id_sucursal', { count: 'exact', head: true }).eq('activo', true),
            ])
          : Promise.resolve(null),
      ]);

      if (solicitudesPendientesRes.error) throw solicitudesPendientesRes.error;
      if (inventarioRes.error) throw inventarioRes.error;

      const items = inventarioRes.data ?? [];
      const stockBajo = items.filter((item) => Number(item.stock_actual) < Number(item.stock_minimo)).length;
      const porVencer = items.filter(
        (item) => item.fecha_vencimiento && item.fecha_vencimiento <= limiteVencimientoStr
      ).length;

      let usuariosActivos = null;
      let sucursalesActivas = null;
      if (adminRes) {
        const [usuariosRes, sucursalesRes] = adminRes;
        if (usuariosRes.error) throw usuariosRes.error;
        if (sucursalesRes.error) throw sucursalesRes.error;
        usuariosActivos = usuariosRes.count ?? 0;
        sucursalesActivas = sucursalesRes.count ?? 0;
      }

      setResumen({
        solicitudesPendientes: solicitudesPendientesRes.count ?? 0,
        totalInventario: items.length,
        stockBajo,
        porVencer,
        usuariosActivos,
        sucursalesActivas,
      });
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [idSucursalActiva, esAdministrativo]);

  useEffect(() => {
    fetchResumen();
  }, [fetchResumen]);

  return { resumen, isLoading, error, refetch: fetchResumen };
};

export default useDashboardResumen;
