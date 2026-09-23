import { Pencil, Trash2, Boxes, PackagePlus, PackageMinus } from 'lucide-react';
import { TEXTS } from '../../../../constants/texts';
import { getEstadoVencimiento } from '../../../../utils/vencimiento';
import TableA from 'anteriority-ui/screens/components/TableA/index';
import Button from 'anteriority-ui/screens/components/Button/index';
import Badge from 'anteriority-ui/screens/components/Badge/index';
import styles from './index.module.css';

const VencimientoBadge = ({ fechaVencimiento }) => {
  if (!fechaVencimiento) return <span>—</span>;

  const { estado, dias } = getEstadoVencimiento(fechaVencimiento);

  if (estado === 'vencido') {
    return (
      <span className={styles.vencimientoVencido}>
        {fechaVencimiento}
        <Badge label="" value={TEXTS.inventario.vencimiento.vencidoHace(Math.abs(dias))} iconColor="#dc2626" />
      </span>
    );
  }

  if (estado === 'por_vencer') {
    return (
      <span className={styles.vencimientoPorVencer}>
        {fechaVencimiento}
        <Badge
          label=""
          value={dias === 0 ? TEXTS.inventario.vencimiento.hoy : TEXTS.inventario.vencimiento.porVencer(dias)}
          iconColor="#d97706"
        />
      </span>
    );
  }

  return <span>{fechaVencimiento}</span>;
};

export const InventarioTable = ({ items, isLoading, error, onRetry, onEdit, onDelete, onRegistrarCompra, onSacarStock }) => {
  const columns = [
    { header: TEXTS.inventario.table.codigo, accessor: 'codigo' },
    { header: TEXTS.inventario.table.nombre, accessor: 'nombre' },
    {
      header: TEXTS.inventario.table.stockActual,
      render: (row) => {
        const bajo = Number(row.stock_actual) < Number(row.stock_minimo);
        const exceso = row.stock_maximo != null && Number(row.stock_actual) > Number(row.stock_maximo);
        return (
          <span className={bajo ? styles.stockBajo : undefined}>
            {row.stock_actual}
            {bajo && <Badge label="" value={TEXTS.inventario.stockBajo} iconColor="#dc2626" />}
            {!bajo && exceso && <Badge label="" value={TEXTS.inventario.stockExceso} iconColor="#d97706" />}
          </span>
        );
      },
    },
    { header: TEXTS.inventario.table.stockMinimo, accessor: 'stock_minimo' },
    {
      header: TEXTS.inventario.table.stockMaximo,
      render: (row) => (row.stock_maximo ?? '—'),
    },
    {
      header: TEXTS.inventario.table.fechaVencimiento,
      render: (row) => <VencimientoBadge fechaVencimiento={row.fecha_vencimiento} />,
    },
    {
      header: TEXTS.inventario.table.lote,
      render: (row) => row.lote ?? '—',
    },
    {
      header: TEXTS.inventario.table.proveedor,
      render: (row) => row.proveedores?.razon_social ?? TEXTS.inventario.sinProveedor,
    },
    {
      header: TEXTS.inventario.movimientos.seccionTitle,
      align: 'right',
      render: (row) => (
        <div className={styles.stockActions}>
          <Button
            variant={Button.VARIANTS.GHOST}
            size={Button.SIZES.SMALL}
            circle
            onClick={() => onRegistrarCompra(row)}
            ToolTip={TEXTS.inventario.movimientos.agregarCompra}
          >
            <PackagePlus size={16} color="#088d4f" />
          </Button>
          <Button
            variant={Button.VARIANTS.GHOST}
            size={Button.SIZES.SMALL}
            circle
            onClick={() => onSacarStock(row)}
            ToolTip={TEXTS.inventario.movimientos.sacarStock}
          >
            <PackageMinus size={16} color="#d97706" />
          </Button>
        </div>
      ),
    },
    {
      header: TEXTS.comun.acciones,
      align: 'right',
      render: (row) => (
        <div className={styles.actions}>
          <Button variant={Button.VARIANTS.GHOST} size={Button.SIZES.SMALL} circle onClick={() => onEdit(row)} ToolTip={TEXTS.inventario.editButton}>
            <Pencil size={16} />
          </Button>
          <Button variant={Button.VARIANTS.GHOST} size={Button.SIZES.SMALL} circle onClick={() => onDelete(row)} ToolTip={TEXTS.inventario.deleteButton}>
            <Trash2 size={16} color="#dc2626" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <TableA
      columns={columns}
      data={items}
      keyExtractor={(row) => row.id_item}
      loading={isLoading}
      error={error?.message}
      onRetry={onRetry}
      emptyIcon={Boxes}
      emptyMessage={TEXTS.inventario.empty}
    />
  );
};

export default InventarioTable;
