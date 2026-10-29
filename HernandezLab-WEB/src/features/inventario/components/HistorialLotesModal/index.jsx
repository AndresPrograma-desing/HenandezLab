import { TEXTS } from '../../../../constants/texts';
import { useHistorialLotes } from '../../hooks/useHistorialLotes';
import { pickLoteActual } from '../../hooks/useInventario';
import Frame from 'anteriority-ui/screens/components/Frame/index';
import Button from 'anteriority-ui/screens/components/Button/index';
import Badge from 'anteriority-ui/screens/components/Badge/index';
import TableA from 'anteriority-ui/screens/components/TableA/index';
import styles from './index.module.css';

export const HistorialLotesModal = ({ item, onClose }) => {
  const { lotes, isLoading, error, refetch } = useHistorialLotes(item?.id_item);

  if (!item) return null;

  const loteActual = pickLoteActual(lotes);

  const columns = [
    {
      header: TEXTS.inventario.historial.table.lote,
      render: (row) => (
        <span className={styles.loteCell}>
          {row.numero_lote ?? '—'}
          {loteActual && row.id_lote === loteActual.id_lote && (
            <Badge label="" value={TEXTS.inventario.historial.loteActual} bgColor="#dcfce7" valueColor="#166534" />
          )}
        </span>
      ),
    },
    { header: TEXTS.inventario.historial.table.fechaVencimiento, render: (row) => row.fecha_vencimiento ?? '—' },
    { header: TEXTS.inventario.historial.table.cantidadRecibida, accessor: 'cantidad_recibida' },
    { header: TEXTS.inventario.historial.table.cantidadRestante, accessor: 'cantidad_restante' },
    {
      header: TEXTS.inventario.historial.table.proveedor,
      render: (row) => row.proveedores?.razon_social ?? TEXTS.inventario.sinProveedor,
    },
    {
      header: TEXTS.inventario.historial.table.fechaIngreso,
      render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  return (
    <Frame title={TEXTS.inventario.historial.title(item.nombre)} isModal onClose={onClose}>
      <TableA
        columns={columns}
        data={lotes}
        keyExtractor={(row) => row.id_lote}
        loading={isLoading}
        error={error?.message}
        onRetry={refetch}
        emptyMessage={TEXTS.inventario.historial.empty}
      />
      <div className={styles.actions}>
        <Button variant={Button.VARIANTS.OUTLINE} onClick={onClose}>
          {TEXTS.inventario.historial.close}
        </Button>
      </div>
    </Frame>
  );
};

export default HistorialLotesModal;
