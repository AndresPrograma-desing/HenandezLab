import { supabase } from '../../../lib/supabaseClient';

export const usePacientes = () => {
  const findByCedula = async (cedula) => {
    const { data, error } = await supabase.from('pacientes').select('*').eq('cedula', cedula).maybeSingle();
    if (error) throw error;
    return data;
  };

  // Idempotente: si la cédula ya existe no se toca el registro ni se falla
  // (ON CONFLICT DO NOTHING), así un reintento tras una solicitud fallida o
  // un doble envío no choca con pacientes_pkey.
  const createPaciente = async (values) => {
    const { error } = await supabase.from('pacientes').upsert(values, { onConflict: 'cedula', ignoreDuplicates: true });
    if (error) throw error;
  };

  return { findByCedula, createPaciente };
};
