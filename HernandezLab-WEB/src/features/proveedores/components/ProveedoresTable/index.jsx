import { Pencil, Trash2, Truck } from 'lucide-react';
import { TEXTS } from '../../../../constants/texts';
import TableA from 'anteriority-ui/screens/components/TableA/index';
import Button from 'anteriority-ui/screens/components/Button/index';
import styles from './index.module.css';

export const ProveedoresTable = ({ proveedores, isLoading, error, onRetry, onEdit, onDelete }) => {
  const columns = [
    { header: TEXTS.proveedores.table.rif, accessor: 'rif_cedula' },
    { header: TEXTS.proveedores.table.razonSocial, accessor: 'razon_social' },
    { header: TEXTS.proveedores.table.contacto, accessor: 'persona_contacto' },
    { header: TEXTS.proveedores.table.telefono, accessor: 'telefono' },
    {
      header: TEXTS.comun.acciones,
      align: 'right',
      render: (row) => (
        <div className={styles.actions}>
          <Button variant={Button.VARIANTS.GHOST} size={Button.SIZES.SMALL} circle onClick={() => onEdit(row)} ToolTip={TEXTS.proveedores.editButton}>
            <Pencil size={16} />
          </Button>
          <Button variant={Button.VARIANTS.GHOST} size={Button.SIZES.SMALL} circle onClick={() => onDelete(row)} ToolTip={TEXTS.proveedores.deleteButton}>
            <Trash2 size={16} color="#dc2626" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <TableA
      columns={columns}
      data={proveedores}
      keyExtractor={(row) => row.id_proveedor}
      loading={isLoading}
      error={error?.message}
      onRetry={onRetry}
      emptyIcon={Truck}
      emptyMessage={TEXTS.proveedores.empty}
    />
  );
};

export default ProveedoresTable;
