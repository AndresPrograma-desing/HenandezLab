import { Pencil, Trash2, Boxes } from 'lucide-react';
import { TEXTS } from '../../../../constants/texts';
import TableA from 'anteriority-ui/screens/components/TableA/index';
import Button from 'anteriority-ui/screens/components/Button/index';
import Badge from 'anteriority-ui/screens/components/Badge/index';
import styles from './index.module.css';

export const InventarioTable = ({ items, isLoading, error, onRetry, onEdit, onDelete }) => {
  const columns = [
    { header: TEXTS.inventario.table.codigo, accessor: 'codigo' },
    { header: TEXTS.inventario.table.nombre, accessor: 'nombre' },
    {
      header: TEXTS.inventario.table.stockActual,
      render: (row) => {
        const bajo = Number(row.stock_actual) < Number(row.stock_minimo);
        return (
          <span className={bajo ? styles.stockBajo : undefined}>
            {row.stock_actual}
            {bajo && <Badge label="" value={TEXTS.inventario.stockBajo} iconColor="#dc2626" />}
          </span>
        );
      },
    },
    { header: TEXTS.inventario.table.stockMinimo, accessor: 'stock_minimo' },
    {
      header: TEXTS.inventario.table.fechaVencimiento,
      render: (row) => row.fecha_vencimiento ?? '—',
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
