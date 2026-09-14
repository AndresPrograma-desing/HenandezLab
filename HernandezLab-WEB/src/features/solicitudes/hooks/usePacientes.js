import { supabase } from '../../../lib/supabaseClient';

export const usePacientes = () => {
  const findByCedula = async (cedula) => {
    const { data, error } = await supabase.from('pacientes').select('*').eq('cedula', cedula).maybeSingle();
    if (error) throw error;
    return data;
  };

  const createPaciente = async (values) => {
    const { data, error } = await supabase.from('pacientes').insert(values).select().single();
    if (error) throw error;
    return data;
  };

  return { findByCedula, createPaciente };
};
