import { ClipboardList, Trash2 } from 'lucide-react';
import { TEXTS } from '../../../../constants/texts';
import TableA from 'anteriority-ui/screens/components/TableA/index';
import Button from 'anteriority-ui/screens/components/Button/index';
import Badge from 'anteriority-ui/screens/components/Badge/index';
import styles from './index.module.css';

const ESTADO_COLORS = {
  pendiente: '#d97706',
  en_proceso: '#2563eb',
  entregado: '#088d4f',
};

export const SolicitudesTable = ({ solicitudes, isLoading, error, onRetry, emptyMessage, onDelete }) => {
  const columns = [
    {
      header: TEXTS.solicitudes.table.paciente,
      render: (row) => {
        const nombre = `${row.pacientes?.nombre ?? ''} ${row.pacientes?.apellido ?? ''}`.trim();
        const cedula = row.pacientes?.cedula;
        if (!nombre) return '—';
        return cedula ? `${nombre} (${cedula})` : nombre;
      },
    },
    { header: TEXTS.solicitudes.table.fecha, accessor: 'fecha_solicitud' },
    {
      header: TEXTS.solicitudes.table.examenes,
      render: (row) => row.detalle_solicitud?.map((d) => d.examenes?.nombre_examen).filter(Boolean).join(', ') || '—',
    },
    {
      header: TEXTS.solicitudes.table.estado,
      render: (row) => (
        <Badge label="" value={TEXTS.solicitudes.estados[row.estado] ?? row.estado} iconColor={ESTADO_COLORS[row.estado]} />
      ),
    },
    {
      header: TEXTS.solicitudes.table.total,
      align: 'right',
      render: (row) => `$${Number(row.total_pagar).toFixed(2)}`,
    },
    ...(onDelete
      ? [
          {
            header: TEXTS.comun.acciones,
            align: 'right',
            render: (row) => (
              <div className={styles.actions}>
                <Button
                  variant={Button.VARIANTS.GHOST}
                  size={Button.SIZES.SMALL}
                  circle
                  onClick={() => onDelete(row)}
                  ToolTip={TEXTS.solicitudes.deleteButton}
                >
                  <Trash2 size={16} color="#dc2626" />
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <TableA
      columns={columns}
      data={solicitudes}
      keyExtractor={(row) => row.id_solicitud}
      loading={isLoading}
      error={error?.message}
      onRetry={onRetry}
      emptyIcon={ClipboardList}
      emptyMessage={emptyMessage ?? TEXTS.solicitudes.empty}
    />
  );
};

export default SolicitudesTable;
