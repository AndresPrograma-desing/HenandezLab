-- Migración incremental: agrega id_sucursal a compras_reactivos.
-- Antes de esto, una compra no quedaba asociada a ninguna sucursal de forma
-- explícita (solo indirectamente, a través de a qué inventario.id_item
-- apuntaba cada línea de detalle_compra) — un hueco real si hay más de una
-- sucursal operando. Ejecutar en el SQL editor de Supabase.

-- 1. Agregar la columna, nullable por ahora (hay que poblarla antes de
--    hacerla not null si ya existen compras).
alter table compras_reactivos add column if not exists id_sucursal uuid references sucursales (id_sucursal) on delete restrict;

-- 2. Poblar compras existentes a partir de la sucursal del primer ítem
--    comprado en cada una (todas las líneas de una compra deberían ser de
--    la misma sucursal en la práctica).
update compras_reactivos c
set id_sucursal = sub.id_sucursal
from (
  select distinct on (dc.id_compra) dc.id_compra, i.id_sucursal
  from detalle_compra dc
  join inventario i on i.id_item = dc.id_item
  order by dc.id_compra, dc.id_detalle_compra
) sub
where sub.id_compra = c.id_compra
  and c.id_sucursal is null;

-- 3. Si alguna compra no se pudo derivar (sin líneas, por ejemplo), hay que
--    resolverla a mano antes del siguiente paso. Esta consulta la muestra:
--    select * from compras_reactivos where id_sucursal is null;

-- 4. Una vez que no queden filas con id_sucursal null, hacerla obligatoria.
alter table compras_reactivos alter column id_sucursal set not null;

create index if not exists compras_reactivos_id_sucursal_idx on compras_reactivos (id_sucursal);

-- 5. El trigger aplicar_detalle_compra ahora valida que el ítem comprado
--    pertenezca a la misma sucursal que la compra, y lanza una excepción si
--    no (evita registrar stock en la sucursal equivocada).
create or replace function public.aplicar_detalle_compra()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id_proveedor uuid;
  v_id_sucursal_compra uuid;
  v_id_sucursal_item uuid;
  v_lote_actual record;
begin
  select id_proveedor, id_sucursal into v_id_proveedor, v_id_sucursal_compra
  from compras_reactivos
  where id_compra = new.id_compra;

  select id_sucursal into v_id_sucursal_item
  from inventario
  where id_item = new.id_item;

  if v_id_sucursal_item is distinct from v_id_sucursal_compra then
    raise exception 'El ítem % no pertenece a la sucursal de esta compra', new.id_item;
  end if;

  update inventario
  set stock_actual = stock_actual + new.cantidad_comprada
  where id_item = new.id_item;

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
