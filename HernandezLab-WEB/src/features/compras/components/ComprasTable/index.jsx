import { ShoppingCart } from 'lucide-react';
import { TEXTS } from '../../../../constants/texts';
import TableA from 'anteriority-ui/screens/components/TableA/index';

export const ComprasTable = ({ compras, isLoading, error, onRetry }) => {
  const columns = [
    { header: TEXTS.compras.table.fecha, accessor: 'fecha_compra' },
    {
      header: TEXTS.compras.table.proveedor,
      render: (row) => row.proveedores?.razon_social ?? '—',
    },
    {
      header: TEXTS.compras.table.numeroFactura,
      render: (row) => row.numero_factura ?? TEXTS.compras.sinFactura,
    },
    {
      header: TEXTS.compras.table.items,
      render: (row) => row.detalle_compra?.length ?? 0,
    },
    {
      header: TEXTS.compras.table.montoTotal,
      render: (row) => `$${Number(row.monto_total).toFixed(2)}`,
    },
    {
      header: TEXTS.compras.table.empleado,
      render: (row) => (row.empleados ? `${row.empleados.nombre} ${row.empleados.apellido}` : '—'),
    },
  ];

  return (
    <TableA
      columns={columns}
      data={compras}
      keyExtractor={(row) => row.id_compra}
      loading={isLoading}
      error={error?.message}
      onRetry={onRetry}
      emptyIcon={ShoppingCart}
      emptyMessage={TEXTS.compras.empty}
    />
  );
};

export default ComprasTable;
