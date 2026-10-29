-- Datos mínimos para poder probar login y RLS localmente.
-- Ejecutar en el SQL editor de Supabase DESPUÉS de schema.sql.

-- 1. Sucursal de prueba
insert into sucursales (id_sucursal, nombre, direccion, telefono, activo)
values (gen_random_uuid(), 'Sede Principal', 'Por definir', null, true)
on conflict do nothing;

-- 2. Empleado administrativo, todavía sin cuenta de login (auth_user_id null).
--    Reemplazar la cédula/nombre por los datos reales del primer admin.
insert into empleados (cedula, nombre, apellido, cargo, estado_activo, rol, id_sucursal)
select
  'V00000001',
  'Admin',
  'Principal',
  'Administrador del sistema',
  true,
  'administrativo',
  id_sucursal
from sucursales
where nombre = 'Sede Principal'
on conflict (cedula) do nothing;

-- 3. Vincular ese empleado a una cuenta real de Supabase Auth:
--    a) Crear el usuario en el Dashboard de Supabase: Authentication -> Users -> Add user
--       (email + contraseña). Copiar el UUID que le asigna.
--    b) Correr este UPDATE con ese UUID:
--
-- update empleados
-- set auth_user_id = '00000000-0000-0000-0000-000000000000' -- reemplazar por el UUID real
-- where cedula = 'V00000001';
