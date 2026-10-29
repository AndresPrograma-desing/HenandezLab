-- Datos de demostración (volumen "tipo prod") para probar el sistema con algo más real
-- que el seed mínimo. Ejecutar en el SQL editor de Supabase DESPUÉS de schema.sql y de
-- seed_datos_minimos.sql (usa la sucursal "Sede Principal" y el empleado V00000001 de ese).
--
-- Solo para pruebas: no crea cuentas de Supabase Auth para el personal nuevo (auth_user_id
-- queda null salvo para V00000001, que ya vinculaste a mano). Esas filas sirven para probar
-- listados/CRUD/RLS de "empleados", no para loguearse con ellas.

-- ============================================================================
-- Sucursales adicionales
-- ============================================================================

insert into sucursales (nombre, direccion, telefono, activo)
select 'Sede Este', 'Av. Principal, Zona Este', '0212-5551122', true
where not exists (select 1 from sucursales where nombre = 'Sede Este');

insert into sucursales (nombre, direccion, telefono, activo)
select 'Sede Oeste', 'Calle Real, Zona Oeste', '0212-5553344', true
where not exists (select 1 from sucursales where nombre = 'Sede Oeste');

-- ============================================================================
-- Empleados
-- ============================================================================

insert into empleados (cedula, nombre, apellido, cargo, estado_activo, rol, id_sucursal)
select 'V00000002', 'Rosa', 'Delgado', 'Recepcionista', true, 'recepcion', s.id_sucursal
from sucursales s where s.nombre = 'Sede Principal'
on conflict (cedula) do nothing;

insert into empleados (cedula, nombre, apellido, cargo, estado_activo, rol, id_sucursal)
select 'V00000003', 'Miguel', 'Torres', 'Coordinador de sede', true, 'administrativo', s.id_sucursal
from sucursales s where s.nombre = 'Sede Este'
on conflict (cedula) do nothing;

insert into empleados (cedula, nombre, apellido, cargo, estado_activo, rol, id_sucursal)
select 'V00000004', 'Carla', 'Suárez', 'Recepcionista', true, 'recepcion', s.id_sucursal
from sucursales s where s.nombre = 'Sede Este'
on conflict (cedula) do nothing;

insert into empleados (cedula, nombre, apellido, cargo, estado_activo, rol, id_sucursal)
select 'V00000005', 'Pedro', 'Blanco', 'Recepcionista', false, 'recepcion', s.id_sucursal
from sucursales s where s.nombre = 'Sede Oeste'
on conflict (cedula) do nothing;

-- ============================================================================
-- Pacientes
-- ============================================================================

insert into pacientes (cedula, nombre, apellido, fecha_nacimiento, genero) values
  ('V20111222', 'Juan', 'Pérez', '1990-05-14', 'M'),
  ('V20333444', 'María', 'Gómez', '1985-11-02', 'F'),
  ('V20555666', 'Carlos', 'Rodríguez', '2001-01-20', 'M'),
  ('V20777888', 'Ana', 'Martínez', '1998-07-09', 'F'),
  ('V20999000', 'Luis', 'Fernández', '1975-03-30', 'M')
on conflict (cedula) do nothing;

-- ============================================================================
-- Exámenes (catálogo)
-- ============================================================================

insert into examenes (codigo_examen, nombre_examen, precio, tiempo_entrega) values
  ('HEM001', 'Hematología Completa', 15.00, '24 horas'),
  ('GLU001', 'Glucosa en Ayunas', 8.00, '4 horas'),
  ('ORI001', 'Examen de Orina', 10.00, '24 horas'),
  ('COL001', 'Perfil Lipídico', 20.00, '24 horas'),
  ('TIR001', 'Perfil Tiroideo', 35.00, '48 horas'),
  ('COV001', 'Prueba COVID-19 (Antígeno)', 12.00, '30 minutos')
on conflict (codigo_examen) do nothing;

-- ============================================================================
-- Proveedores
-- ============================================================================

insert into proveedores (rif_cedula, razon_social, persona_contacto, telefono) values
  ('J-12345678-9', 'Distribuidora Médica XYZ', 'Pedro Ramírez', '0212-9990001'),
  ('J-23456789-0', 'Insumos del Este C.A.', 'Laura Díaz', '0212-9990002'),
  ('J-34567890-1', 'BioReactivos Andinos', 'Jorge Salas', '0212-9990003')
on conflict (rif_cedula) do nothing;

-- ============================================================================
-- Inventario (las 4 categorías, con algunos ítems intencionalmente bajo su
-- stock mínimo para poder probar la alerta).
-- ============================================================================

insert into inventario (id_sucursal, id_proveedor, categoria, codigo, nombre, stock_actual, stock_minimo, fecha_vencimiento, lote)
select s.id_sucursal, p.id_proveedor, v.categoria, v.codigo, v.nombre, v.stock_actual, v.stock_minimo, v.fecha_vencimiento, v.lote
from sucursales s
cross join lateral (
  values
    ('insumos', 'INS-001', 'Guantes de Nitrilo (caja x100)', 500, 100, null::date, null),
    ('insumos', 'INS-002', 'Jeringas 5ml', 300, 50, null::date, null),
    ('insumos', 'INS-003', 'Tubos de Ensayo', 30, 40, null::date, null),
    ('reactivos', 'REA-001', 'Reactivo Glucosa', 50, 20, '2027-06-01'::date, 'L2026A'),
    ('reactivos', 'REA-002', 'Reactivo Hemoglobina', 15, 20, '2027-03-15'::date, 'L2026B'),
    ('reactivos', 'REA-003', 'Reactivo TSH', 40, 10, '2027-09-10'::date, 'L2026C'),
    ('mobiliario', 'MOB-001', 'Silla de Espera', 20, 5, null::date, null),
    ('mobiliario', 'MOB-002', 'Camilla', 4, 2, null::date, null),
    ('maquinaria', 'MAQ-001', 'Centrífuga', 2, 1, null::date, null),
    ('maquinaria', 'MAQ-002', 'Analizador Químico', 1, 1, null::date, null)
) as v(categoria, codigo, nombre, stock_actual, stock_minimo, fecha_vencimiento, lote)
join proveedores p on p.rif_cedula = 'J-12345678-9'
where s.nombre = 'Sede Principal'
on conflict (id_sucursal, codigo) do nothing;

insert into inventario (id_sucursal, id_proveedor, categoria, codigo, nombre, stock_actual, stock_minimo)
select s.id_sucursal, p.id_proveedor, v.categoria, v.codigo, v.nombre, v.stock_actual, v.stock_minimo
from sucursales s
cross join lateral (
  values
    ('insumos', 'INS-001', 'Guantes de Nitrilo (caja x100)', 150, 50),
    ('reactivos', 'REA-001', 'Reactivo Glucosa', 10, 15),
    ('mobiliario', 'MOB-001', 'Silla de Espera', 8, 3)
) as v(categoria, codigo, nombre, stock_actual, stock_minimo)
join proveedores p on p.rif_cedula = 'J-23456789-0'
where s.nombre = 'Sede Este'
on conflict (id_sucursal, codigo) do nothing;

-- ============================================================================
-- Reactivos/insumos requeridos por examen (receta), en Sede Principal.
-- ============================================================================

insert into reactivos_por_examen (id_examen, id_item, cantidad_requerida)
select e.id_examen, i.id_item, r.cantidad
from (values
  ('GLU001', 'REA-001', 2),
  ('HEM001', 'REA-002', 1),
  ('TIR001', 'REA-003', 3)
) as r(codigo_examen, codigo_item, cantidad)
join examenes e on e.codigo_examen = r.codigo_examen
join inventario i on i.codigo = r.codigo_item
join sucursales s on s.id_sucursal = i.id_sucursal and s.nombre = 'Sede Principal'
on conflict (id_examen, id_item) do nothing;

-- ============================================================================
-- Una compra de reposición a proveedor (dispara el trigger que incrementa stock).
-- ============================================================================

with nueva_compra as (
  insert into compras_reactivos (id_sucursal, id_proveedor, cedula_empleado, fecha_compra, numero_factura, monto_total)
  select s.id_sucursal, p.id_proveedor, 'V00000001', current_date, 'F-0001', 100.00
  from proveedores p
  cross join sucursales s
  where p.rif_cedula = 'J-12345678-9' and s.nombre = 'Sede Principal'
  returning id_compra
)
insert into detalle_compra (id_compra, id_item, cantidad_comprada, costo_unitario)
select nc.id_compra, i.id_item, 20, 5.00
from nueva_compra nc
cross join inventario i
join sucursales s on s.id_sucursal = i.id_sucursal
where s.nombre = 'Sede Principal' and i.codigo = 'REA-001';

-- ============================================================================
-- Solicitudes de examen de muestra (disparan el descuento automático de
-- inventario según reactivos_por_examen).
-- ============================================================================

with nueva_solicitud as (
  insert into solicitudes (cedula_paciente, cedula_empleado, id_sucursal, fecha_solicitud, estado, total_pagar)
  select 'V20111222', 'V00000002', s.id_sucursal, current_date, 'pendiente', 8.00
  from sucursales s where s.nombre = 'Sede Principal'
  returning id_solicitud
)
insert into detalle_solicitud (id_solicitud, id_examen)
select ns.id_solicitud, e.id_examen
from nueva_solicitud ns
join examenes e on e.codigo_examen = 'GLU001';

with nueva_solicitud as (
  insert into solicitudes (cedula_paciente, cedula_empleado, id_sucursal, fecha_solicitud, estado, total_pagar)
  select 'V20333444', 'V00000002', s.id_sucursal, current_date, 'en_proceso', 50.00
  from sucursales s where s.nombre = 'Sede Principal'
  returning id_solicitud
)
insert into detalle_solicitud (id_solicitud, id_examen)
select ns.id_solicitud, e.id_examen
from nueva_solicitud ns
cross join examenes e
where e.codigo_examen in ('HEM001', 'TIR001');

with nueva_solicitud as (
  insert into solicitudes (cedula_paciente, cedula_empleado, id_sucursal, fecha_solicitud, estado, total_pagar)
  select 'V20555666', 'V00000002', s.id_sucursal, current_date, 'entregado', 10.00
  from sucursales s where s.nombre = 'Sede Principal'
  returning id_solicitud
)
insert into detalle_solicitud (id_solicitud, id_examen, resultado, estado_examen)
select ns.id_solicitud, e.id_examen, 'Normal', 'entregado'
from nueva_solicitud ns
join examenes e on e.codigo_examen = 'ORI001';
