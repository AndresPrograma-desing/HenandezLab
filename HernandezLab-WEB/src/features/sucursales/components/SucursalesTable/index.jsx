import { Pencil, Trash2, Building2 } from 'lucide-react';
import { TEXTS } from '../../../../constants/texts';
import TableA from 'anteriority-ui/screens/components/TableA/index';
import Button from 'anteriority-ui/screens/components/Button/index';
import Badge from 'anteriority-ui/screens/components/Badge/index';
import styles from './index.module.css';

export const SucursalesTable = ({ sucursales, isLoading, error, onRetry, onEdit, onDelete }) => {
  const columns = [
    { header: TEXTS.sucursales.table.nombre, accessor: 'nombre' },
    { header: TEXTS.sucursales.table.direccion, accessor: 'direccion' },
    { header: TEXTS.sucursales.table.telefono, accessor: 'telefono' },
    {
      header: TEXTS.sucursales.table.estado,
      render: (row) => (
        <Badge
          label=""
          value={row.activo ? TEXTS.comun.activo : TEXTS.comun.inactivo}
          iconColor={row.activo ? '#088d4f' : '#dc2626'}
        />
      ),
    },
    {
      header: TEXTS.comun.acciones,
      align: 'right',
      render: (row) => (
        <div className={styles.actions}>
          <Button variant={Button.VARIANTS.GHOST} size={Button.SIZES.SMALL} circle onClick={() => onEdit(row)} ToolTip={TEXTS.sucursales.editButton}>
            <Pencil size={16} />
          </Button>
          <Button variant={Button.VARIANTS.GHOST} size={Button.SIZES.SMALL} circle onClick={() => onDelete(row)} ToolTip={TEXTS.sucursales.deleteButton}>
            <Trash2 size={16} color="#dc2626" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <TableA
      columns={columns}
      data={sucursales}
      keyExtractor={(row) => row.id_sucursal}
      loading={isLoading}
      error={error?.message}
      onRetry={onRetry}
      emptyIcon={Building2}
      emptyMessage={TEXTS.sucursales.empty}
    />
  );
};

export default SucursalesTable;
