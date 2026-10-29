-- Agrega la función crear_solicitud_con_examenes (ya está también al final de
-- schema.sql para que quede documentada ahí). Ejecutar en el SQL editor de
-- Supabase antes de probar el módulo de Solicitudes.

create or replace function public.crear_solicitud_con_examenes(
  p_cedula_paciente text,
  p_cedula_empleado text,
  p_id_sucursal uuid,
  p_examenes uuid[]
)
returns uuid
language plpgsql
as $$
declare
  v_id_solicitud uuid;
  v_total numeric(10, 2);
  v_id_examen uuid;
begin
  select coalesce(sum(precio), 0) into v_total
  from examenes
  where id_examen = any(p_examenes);

  insert into solicitudes (cedula_paciente, cedula_empleado, id_sucursal, total_pagar)
  values (p_cedula_paciente, p_cedula_empleado, p_id_sucursal, v_total)
  returning id_solicitud into v_id_solicitud;

  foreach v_id_examen in array p_examenes loop
    insert into detalle_solicitud (id_solicitud, id_examen) values (v_id_solicitud, v_id_examen);
  end loop;

  return v_id_solicitud;
end;
$$;

grant execute on function public.crear_solicitud_con_examenes(text, text, uuid, uuid[]) to authenticated;
