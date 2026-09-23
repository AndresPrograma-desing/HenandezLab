// Umbral de días para considerar un ítem "próximo a vencer".
export const DIAS_ALERTA_VENCIMIENTO = 30;

/**
 * Compara la fecha de vencimiento de un ítem contra la fecha actual y
 * devuelve su estado (vencido / por_vencer / vigente) junto con los días
 * de diferencia, para poder mostrar avisos en la tabla de inventario.
 */
export const getEstadoVencimiento = (fechaVencimiento, hoy = new Date()) => {
  if (!fechaVencimiento) return { estado: 'sin_fecha', dias: null };

  const fecha = new Date(`${fechaVencimiento}T00:00:00`);
  if (Number.isNaN(fecha.getTime())) return { estado: 'sin_fecha', dias: null };

  const hoyNormalizado = new Date(hoy);
  hoyNormalizado.setHours(0, 0, 0, 0);

  const dias = Math.round((fecha.getTime() - hoyNormalizado.getTime()) / (1000 * 60 * 60 * 24));

  if (dias < 0) return { estado: 'vencido', dias };
  if (dias <= DIAS_ALERTA_VENCIMIENTO) return { estado: 'por_vencer', dias };
  return { estado: 'vigente', dias };
};

export default getEstadoVencimiento;
