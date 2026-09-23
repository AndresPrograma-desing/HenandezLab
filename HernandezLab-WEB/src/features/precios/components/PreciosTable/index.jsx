import { Pencil, Tag } from 'lucide-react';
import { TEXTS } from '../../../../constants/texts';
import TableA from 'anteriority-ui/screens/components/TableA/index';
import Button from 'anteriority-ui/screens/components/Button/index';
import styles from './index.module.css';

export const PreciosTable = ({ items, isLoading, error, onRetry, onEdit }) => {
  const columns = [
    { header: TEXTS.precios.table.codigo, accessor: 'codigo' },
    { header: TEXTS.precios.table.nombre, accessor: 'nombre' },
    {
      header: TEXTS.precios.table.categoria,
      render: (row) => TEXTS.inventario.categorias[row.categoria] ?? row.categoria,
    },
    { header: TEXTS.precios.table.stockActual, accessor: 'stock_actual' },
    {
      header: TEXTS.precios.table.precio,
      render: (row) =>
        row.precio != null ? `$${Number(row.precio).toFixed(2)}` : <span className={styles.sinPrecio}>{TEXTS.precios.sinPrecio}</span>,
    },
    {
      header: TEXTS.comun.acciones,
      align: 'right',
      render: (row) => (
        <div className={styles.actions}>
          <Button
            variant={Button.VARIANTS.GHOST}
            size={Button.SIZES.SMALL}
            circle
            onClick={() => onEdit(row)}
            ToolTip={TEXTS.precios.editButton}
          >
            <Pencil size={16} />
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
      emptyIcon={Tag}
      emptyMessage={TEXTS.precios.empty}
    />
  );
};

export default PreciosTable;
