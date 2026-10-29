-- Migración incremental: historial de lotes + proveedor por compra.
-- Ejecutar en el SQL editor de Supabase sobre una base que ya tiene el
-- schema.sql original aplicado (no reemplaza tablas existentes).

-- 1. Nuevas columnas en detalle_compra para capturar lote/vencimiento por línea de compra.
alter table detalle_compra add column if not exists numero_lote text;
alter table detalle_compra add column if not exists fecha_vencimiento date;

-- 2. Historial de lotes.
create table if not exists lotes_inventario (
  id_lote uuid primary key default gen_random_uuid(),
  id_item uuid not null references inventario (id_item) on delete cascade,
  id_compra uuid references compras_reactivos (id_compra) on delete set null,
  id_proveedor uuid references proveedores (id_proveedor) on delete set null,
  numero_lote text,
  fecha_vencimiento date,
  cantidad_recibida numeric(10, 2) not null check (cantidad_recibida > 0),
  cantidad_restante numeric(10, 2) not null default 0 check (cantidad_restante >= 0),
  created_at timestamptz not null default now()
);

create index if not exists lotes_inventario_id_item_idx on lotes_inventario (id_item);

-- 3. Reemplaza el trigger de aplicación de compra: ahora también registra el
--    lote en el historial y recalcula el lote "actual" (FEFO) del ítem.
create or replace function public.aplicar_detalle_compra()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id_proveedor uuid;
  v_lote_actual record;
begin
  update inventario
  set stock_actual = stock_actual + new.cantidad_comprada
  where id_item = new.id_item;

  select id_proveedor into v_id_proveedor
  from compras_reactivos
  where id_compra = new.id_compra;

  insert into lotes_inventario (
    id_item, id_compra, id_proveedor, numero_lote, fecha_vencimiento,
    cantidad_recibida, cantidad_restante
  ) values (
    new.id_item, new.id_compra, v_id_proveedor, new.numero_lote, new.fecha_vencimiento,
    new.cantidad_comprada, new.cantidad_comprada
  );

  select numero_lote, fecha_vencimiento into v_lote_actual
  from lotes_inventario
  where id_item = new.id_item
    and cantidad_restante > 0
    and fecha_vencimiento is not null
  order by fecha_vencimiento asc
  limit 1;

  if v_lote_actual is not null then
    update inventario
    set lote = v_lote_actual.numero_lote,
        fecha_vencimiento = v_lote_actual.fecha_vencimiento
    where id_item = new.id_item;
  end if;

  return new;
end;
$$;

-- 4. RLS de lotes_inventario (mismo criterio que inventario).
alter table lotes_inventario enable row level security;

drop policy if exists "lotes_inventario_admin_all" on lotes_inventario;
create policy "lotes_inventario_admin_all" on lotes_inventario
  for all using (current_empleado_rol() = 'administrativo')
  with check (current_empleado_rol() = 'administrativo');

drop policy if exists "lotes_inventario_recepcion_own_sucursal" on lotes_inventario;
create policy "lotes_inventario_recepcion_own_sucursal" on lotes_inventario
  for select using (
    current_empleado_rol() = 'recepcion'
    and exists (
      select 1 from inventario i
      where i.id_item = lotes_inventario.id_item
        and i.id_sucursal = current_empleado_sucursal()
    )
  );
