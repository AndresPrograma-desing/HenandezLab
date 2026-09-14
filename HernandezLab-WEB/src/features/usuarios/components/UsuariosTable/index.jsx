import { Pencil, Trash2, Users } from 'lucide-react';
import { TEXTS } from '../../../../constants/texts';
import TableA from 'anteriority-ui/screens/components/TableA/index';
import Button from 'anteriority-ui/screens/components/Button/index';
import Badge from 'anteriority-ui/screens/components/Badge/index';
import styles from './index.module.css';

export const UsuariosTable = ({ usuarios, isLoading, error, onRetry, onEdit, onDelete }) => {
  const columns = [
    { header: TEXTS.usuarios.table.cedula, accessor: 'cedula' },
    { header: TEXTS.usuarios.table.nombre, accessor: 'nombre' },
    { header: TEXTS.usuarios.table.apellido, accessor: 'apellido' },
    { header: TEXTS.usuarios.table.cargo, accessor: 'cargo' },
    {
      header: TEXTS.usuarios.table.rol,
      render: (row) => TEXTS.roles[row.rol] ?? row.rol,
    },
    {
      header: TEXTS.usuarios.table.sucursal,
      render: (row) => row.sucursales?.nombre ?? '—',
    },
    {
      header: TEXTS.usuarios.table.estado,
      render: (row) => (
        <Badge
          label=""
          value={row.estado_activo ? TEXTS.comun.activo : TEXTS.comun.inactivo}
          iconColor={row.estado_activo ? '#088d4f' : '#dc2626'}
        />
      ),
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
            ToolTip={TEXTS.usuarios.editButton}
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant={Button.VARIANTS.GHOST}
            size={Button.SIZES.SMALL}
            circle
            onClick={() => onDelete(row)}
            ToolTip={TEXTS.usuarios.deleteButton}
          >
            <Trash2 size={16} color="#dc2626" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <TableA
      columns={columns}
      data={usuarios}
      keyExtractor={(row) => row.cedula}
      loading={isLoading}
      error={error?.message}
      onRetry={onRetry}
      emptyIcon={Users}
      emptyMessage={TEXTS.usuarios.empty}
    />
  );
};

export default UsuariosTable;
