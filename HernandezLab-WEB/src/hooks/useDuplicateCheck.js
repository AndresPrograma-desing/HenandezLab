import { useCallback, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * Verifica si ya existe un registro con los valores indicados antes de
 * intentar crearlo, para poder avisarle al usuario de inmediato en vez de
 * esperar el error de restricción única de la base de datos.
 *
 * Uso: const existe = await checkDuplicado('empleados', { cedula: 'V12345678' });
 */
export const useDuplicateCheck = () => {
  const [checking, setChecking] = useState(false);

  const checkDuplicado = useCallback(async (table, filters, { excludeId, excludeColumn } = {}) => {
    const entries = Object.entries(filters).filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== '');
    if (entries.length === 0) return false;

    setChecking(true);
    try {
      let query = supabase.from(table).select(entries[0][0]);
      entries.forEach(([column, value]) => {
        query = query.eq(column, typeof value === 'string' ? value.trim() : value);
      });
      if (excludeId !== undefined && excludeColumn) {
        query = query.neq(excludeColumn, excludeId);
      }

      const { data, error } = await query.limit(1);
      if (error) return false;
      return Boolean(data && data.length > 0);
    } finally {
      setChecking(false);
    }
  }, []);

  return { checkDuplicado, checking };
};

export default useDuplicateCheck;
