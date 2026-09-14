import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export const useExamenes = () => {
  const [examenes, setExamenes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase
      .from('examenes')
      .select('*')
      .order('nombre_examen', { ascending: true })
      .then(({ data }) => {
        if (!active) return;
        setExamenes(data ?? []);
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { examenes, isLoading };
};
