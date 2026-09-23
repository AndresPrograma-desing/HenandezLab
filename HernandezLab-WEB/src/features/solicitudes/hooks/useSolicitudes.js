import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export const useSolicitudes = (idSucursal) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSolicitudes = useCallback(async () => {
    if (!idSucursal) {
      setSolicitudes([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('solicitudes')
      .select('*, pacientes(nombre, apellido, cedula), detalle_solicitud(id_examen, examenes(nombre_examen))')
      .eq('id_sucursal', idSucursal)
      .order('fecha_solicitud', { ascending: false });

    if (fetchError) {
      setError(fetchError);
    } else {
      setSolicitudes(data ?? []);
    }
    setIsLoading(false);
  }, [idSucursal]);

  useEffect(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

  const createSolicitud = async ({ cedulaPaciente, cedulaEmpleado, examenIds }) => {
    const { data, error: rpcError } = await supabase.rpc('crear_solicitud_con_examenes', {
      p_cedula_paciente: cedulaPaciente,
      p_cedula_empleado: cedulaEmpleado,
      p_id_sucursal: idSucursal,
      p_examenes: examenIds,
    });

    if (rpcError) throw rpcError;
    await fetchSolicitudes();
    return data;
  };

  return {
    solicitudes,
    isLoading,
    error,
    refetch: fetchSolicitudes,
    createSolicitud,
  };
};
