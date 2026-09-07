-- HernandezLab schema
-- Ejecutar en el SQL editor de Supabase (mismo proyecto que KeepContext/ContextHub; nombres de
-- tabla no chocan con projects/sessions/pending_items/profiles/etc. de ese otro proyecto).

create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. Sucursales
-- ============================================================================

create table if not exists sucursales (
  id_sucursal uuid primary key default gen_random_uuid(),
  nombre text not null,
  direccion text,
  telefono text,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 2. Empleados (= "usuarios" del sistema: la fila base es de RRHH; se vuelve
--    un login real cuando auth_user_id apunta a una cuenta de Supabase Auth).
-- ============================================================================

create table if not exists empleados (
  cedula text primary key,
  nombre text not null,
  apellido text not null,
  cargo text,
  estado_activo boolean not null default true,
  rol text not null check (rol in ('administrativo', 'recepcion')),
  id_sucursal uuid not null references sucursales (id_sucursal) on delete restrict,
  auth_user_id uuid unique references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists empleados_id_sucursal_idx on empleados (id_sucursal);
create index if not exists empleados_auth_user_id_idx on empleados (auth_user_id);

-- ============================================================================
-- 3. Pacientes
-- ============================================================================

create table if not exists pacientes (
  cedula text primary key,
  nombre text not null,
  apellido text not null,
  fecha_nacimiento date not null,
  genero text not null check (genero in ('M', 'F')),
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 4. Exámenes (catálogo)
-- ============================================================================

create table if not exists examenes (
  id_examen uuid primary key default gen_random_uuid(),
  codigo_examen text not null unique,
  nombre_examen text not null,
  precio numeric(10, 2) not null default 0,
  tiempo_entrega text,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 5. Proveedores (modelo mínimo; el usuario indicó que aún no está definido
--    del todo, se deja el CRUD básico del diagrama de referencia).
-- ============================================================================

create table if not exists proveedores (
  id_proveedor uuid primary key default gen_random_uuid(),
  rif_cedula text not null unique,
  razon_social text not null,
  persona_contacto text,
  telefono text,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 6. Inventario general (insumos, reactivos, mobiliario, maquinaria), por
--    sucursal. fecha_vencimiento/lote solo aplican en la práctica a
--    insumos/reactivos, se dejan nullable para mobiliario/maquinaria.
-- ============================================================================

create table if not exists inventario (
  id_item uuid primary key default gen_random_uuid(),
  id_sucursal uuid not null references sucursales (id_sucursal) on delete restrict,
  id_proveedor uuid references proveedores (id_proveedor) on delete set null,
  categoria text not null check (categoria in ('insumos', 'reactivos', 'mobiliario', 'maquinaria')),
  codigo text not null,
  nombre text not null,
  stock_actual numeric(10, 2) not null default 0 check (stock_actual >= 0),
  stock_minimo numeric(10, 2) not null default 0,
  fecha_vencimiento date,
  lote text,
  created_at timestamptz not null default now(),
  unique (id_sucursal, codigo)
);

create index if not exists inventario_id_sucursal_idx on inventario (id_sucursal);
create index if not exists inventario_categoria_idx on inventario (categoria);

-- ============================================================================
-- 7. Reactivos/insumos requeridos por examen ("receta" de cada examen).
--    Nota: id_item referencia una fila de inventario, que ya es específica de
--    una sucursal. Con una sola sucursal operando esto no es un problema; si
--    se abren varias sucursales con catálogos de items distintos, esta tabla
--    va a necesitar una fila por sucursal por examen (o separar inventario en
--    catálogo + stock por sucursal). Se deja así por ahora, documentado.
-- ============================================================================

create table if not exists reactivos_por_examen (
  id_relacion uuid primary key default gen_random_uuid(),
  id_examen uuid not null references examenes (id_examen) on delete cascade,
  id_item uuid not null references inventario (id_item) on delete restrict,
  cantidad_requerida numeric(10, 2) not null check (cantidad_requerida > 0),
  unique (id_examen, id_item)
);

create index if not exists reactivos_por_examen_id_examen_idx on reactivos_por_examen (id_examen);

-- ============================================================================
-- 8. Compras a proveedores (reposición de inventario)
-- ============================================================================

create table if not exists compras_reactivos (
  id_compra uuid primary key default gen_random_uuid(),
  id_proveedor uuid not null references proveedores (id_proveedor) on delete restrict,
  cedula_empleado text not null references empleados (cedula) on delete restrict,
  fecha_compra date not null default current_date,
  numero_factura text,
  monto_total numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists detalle_compra (
  id_detalle_compra uuid primary key default gen_random_uuid(),
  id_compra uuid not null references compras_reactivos (id_compra) on delete cascade,
  id_item uuid not null references inventario (id_item) on delete restrict,
  cantidad_comprada numeric(10, 2) not null check (cantidad_comprada > 0),
  costo_unitario numeric(10, 2) not null default 0
);

create index if not exists detalle_compra_id_compra_idx on detalle_compra (id_compra);

-- Al registrar el detalle de una compra, se incrementa el stock del item.
create or replace function public.aplicar_detalle_compra()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  update inventario
  set stock_actual = stock_actual + new.cantidad_comprada
  where id_item = new.id_item;

  return new;
end;
$$;

drop trigger if exists detalle_compra_aplicar on detalle_compra;
create trigger detalle_compra_aplicar
  after insert on detalle_compra
  for each row execute function public.aplicar_detalle_compra();

-- ============================================================================
-- 9. Solicitudes de examen (paciente + exámenes pedidos)
-- ============================================================================

create table if not exists solicitudes (
  id_solicitud uuid primary key default gen_random_uuid(),
  cedula_paciente text not null references pacientes (cedula) on delete restrict,
  cedula_empleado text not null references empleados (cedula) on delete restrict,
  id_sucursal uuid not null references sucursales (id_sucursal) on delete restrict,
  fecha_solicitud date not null default current_date,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'en_proceso', 'entregado')),
  total_pagar numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists solicitudes_id_sucursal_idx on solicitudes (id_sucursal);
create index if not exists solicitudes_cedula_paciente_idx on solicitudes (cedula_paciente);

create table if not exists detalle_solicitud (
  id_detalle uuid primary key default gen_random_uuid(),
  id_solicitud uuid not null references solicitudes (id_solicitud) on delete cascade,
  id_examen uuid not null references examenes (id_examen) on delete restrict,
  resultado text,
  estado_examen text not null default 'pendiente' check (estado_examen in ('pendiente', 'en_proceso', 'entregado')),
  created_at timestamptz not null default now()
);

create index if not exists detalle_solicitud_id_solicitud_idx on detalle_solicitud (id_solicitud);

-- Al pedir un examen, se descuenta del inventario lo que ese examen requiere
-- (reactivos_por_examen), en el momento exacto en que se registra la solicitud.
-- Lanza una excepción si no hay stock suficiente, para no dejar el inventario
-- en negativo (el formulario de Solicitudes debe mostrar ese error al usuario).
create or replace function public.consumir_inventario_por_examen()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  r record;
  v_stock_resultante numeric(10, 2);
begin
  for r in
    select id_item, cantidad_requerida
    from reactivos_por_examen
    where id_examen = new.id_examen
  loop
    update inventario
    set stock_actual = stock_actual - r.cantidad_requerida
    where id_item = r.id_item
    returning stock_actual into v_stock_resultante;

    if v_stock_resultante is null or v_stock_resultante < 0 then
      raise exception 'Stock insuficiente para el ítem % requerido por el examen', r.id_item;
    end if;
  end loop;

  return new;
end;
$$;

drop trigger if exists detalle_solicitud_consumir_inventario on detalle_solicitud;
create trigger detalle_solicitud_consumir_inventario
  after insert on detalle_solicitud
  for each row execute function public.consumir_inventario_por_examen();

-- ============================================================================
-- Funciones auxiliares de RLS (security definer + row_security off para evitar
-- recursión al leer "empleados" desde sus propias policies).
-- ============================================================================

create or replace function public.current_empleado_rol()
returns text
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select rol from empleados where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public.current_empleado_sucursal()
returns uuid
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select id_sucursal from empleados where auth_user_id = auth.uid() limit 1;
$$;

grant execute on function public.current_empleado_rol() to authenticated;
grant execute on function public.current_empleado_sucursal() to authenticated;

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table sucursales enable row level security;
alter table empleados enable row level security;
alter table pacientes enable row level security;
alter table examenes enable row level security;
alter table proveedores enable row level security;
alter table inventario enable row level security;
alter table reactivos_por_examen enable row level security;
alter table compras_reactivos enable row level security;
alter table detalle_compra enable row level security;
alter table solicitudes enable row level security;
alter table detalle_solicitud enable row level security;

-- sucursales: administrativo ve/edita todas; recepción solo lee la suya.
drop policy if exists "sucursales_admin_all" on sucursales;
create policy "sucursales_admin_all" on sucursales
  for all using (current_empleado_rol() = 'administrativo')
  with check (current_empleado_rol() = 'administrativo');

drop policy if exists "sucursales_recepcion_select_own" on sucursales;
create policy "sucursales_recepcion_select_own" on sucursales
  for select using (id_sucursal = current_empleado_sucursal());

-- empleados: administrativo gestiona todos; cada empleado puede leer su propia fila.
drop policy if exists "empleados_admin_all" on empleados;
create policy "empleados_admin_all" on empleados
  for all using (current_empleado_rol() = 'administrativo')
  with check (current_empleado_rol() = 'administrativo');

drop policy if exists "empleados_select_self" on empleados;
create policy "empleados_select_self" on empleados
  for select using (auth_user_id = auth.uid());

-- pacientes: cualquier empleado autenticado (administrativo o recepción) puede
-- gestionar pacientes; no están acotados por sucursal.
drop policy if exists "pacientes_empleados_all" on pacientes;
create policy "pacientes_empleados_all" on pacientes
  for all using (current_empleado_rol() is not null)
  with check (current_empleado_rol() is not null);

-- examenes: catálogo administrado por administrativo; todos los empleados lo leen.
drop policy if exists "examenes_admin_all" on examenes;
create policy "examenes_admin_all" on examenes
  for all using (current_empleado_rol() = 'administrativo')
  with check (current_empleado_rol() = 'administrativo');

drop policy if exists "examenes_select_empleados" on examenes;
create policy "examenes_select_empleados" on examenes
  for select using (current_empleado_rol() is not null);

-- proveedores: solo administrativo.
drop policy if exists "proveedores_admin_all" on proveedores;
create policy "proveedores_admin_all" on proveedores
  for all using (current_empleado_rol() = 'administrativo')
  with check (current_empleado_rol() = 'administrativo');

-- inventario: administrativo gestiona todo; recepción gestiona solo su sucursal.
drop policy if exists "inventario_admin_all" on inventario;
create policy "inventario_admin_all" on inventario
  for all using (current_empleado_rol() = 'administrativo')
  with check (current_empleado_rol() = 'administrativo');

drop policy if exists "inventario_recepcion_own_sucursal" on inventario;
create policy "inventario_recepcion_own_sucursal" on inventario
  for all using (current_empleado_rol() = 'recepcion' and id_sucursal = current_empleado_sucursal())
  with check (current_empleado_rol() = 'recepcion' and id_sucursal = current_empleado_sucursal());

-- reactivos_por_examen: "receta" administrada por administrativo; todos los
-- empleados la leen (la usa el formulario de Solicitudes para mostrar qué se
-- va a consumir antes de confirmar).
drop policy if exists "reactivos_por_examen_admin_all" on reactivos_por_examen;
create policy "reactivos_por_examen_admin_all" on reactivos_por_examen
  for all using (current_empleado_rol() = 'administrativo')
  with check (current_empleado_rol() = 'administrativo');

drop policy if exists "reactivos_por_examen_select_empleados" on reactivos_por_examen;
create policy "reactivos_por_examen_select_empleados" on reactivos_por_examen
  for select using (current_empleado_rol() is not null);

-- compras_reactivos / detalle_compra: solo administrativo.
drop policy if exists "compras_reactivos_admin_all" on compras_reactivos;
create policy "compras_reactivos_admin_all" on compras_reactivos
  for all using (current_empleado_rol() = 'administrativo')
  with check (current_empleado_rol() = 'administrativo');

drop policy if exists "detalle_compra_admin_all" on detalle_compra;
create policy "detalle_compra_admin_all" on detalle_compra
  for all using (
    current_empleado_rol() = 'administrativo'
    and exists (select 1 from compras_reactivos c where c.id_compra = detalle_compra.id_compra)
  )
  with check (
    current_empleado_rol() = 'administrativo'
    and exists (select 1 from compras_reactivos c where c.id_compra = detalle_compra.id_compra)
  );

-- solicitudes / detalle_solicitud: administrativo gestiona todo; recepción
-- gestiona solo las de su sucursal.
drop policy if exists "solicitudes_admin_all" on solicitudes;
create policy "solicitudes_admin_all" on solicitudes
  for all using (current_empleado_rol() = 'administrativo')
  with check (current_empleado_rol() = 'administrativo');

drop policy if exists "solicitudes_recepcion_own_sucursal" on solicitudes;
create policy "solicitudes_recepcion_own_sucursal" on solicitudes
  for all using (current_empleado_rol() = 'recepcion' and id_sucursal = current_empleado_sucursal())
  with check (current_empleado_rol() = 'recepcion' and id_sucursal = current_empleado_sucursal());

drop policy if exists "detalle_solicitud_admin_all" on detalle_solicitud;
create policy "detalle_solicitud_admin_all" on detalle_solicitud
  for all using (current_empleado_rol() = 'administrativo')
  with check (current_empleado_rol() = 'administrativo');

drop policy if exists "detalle_solicitud_recepcion_own_sucursal" on detalle_solicitud;
create policy "detalle_solicitud_recepcion_own_sucursal" on detalle_solicitud
  for all using (
    current_empleado_rol() = 'recepcion'
    and exists (
      select 1 from solicitudes s
      where s.id_solicitud = detalle_solicitud.id_solicitud
        and s.id_sucursal = current_empleado_sucursal()
    )
  )
  with check (
    current_empleado_rol() = 'recepcion'
    and exists (
      select 1 from solicitudes s
      where s.id_solicitud = detalle_solicitud.id_solicitud
        and s.id_sucursal = current_empleado_sucursal()
    )
  );
