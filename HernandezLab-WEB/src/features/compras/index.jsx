import { useState } from 'react';
import { TEXTS } from '../../constants/texts';
import { useAuth } from '../../hooks/useAuth';
import { useSucursalActiva } from '../../hooks/useSucursalActiva';
import { useCompras } from './hooks/useCompras';
import { useProveedores } from '../proveedores/hooks/useProveedores';
import { exportToPdf, formatFecha } from '../../utils/exportPdf';
import { useInventario } from '../inventario/hooks/useInventario';
import { ComprasHeader } from './components/ComprasHeader';
import { ComprasTable } from './components/ComprasTable';
import { CompraFormModal } from './components/CompraFormModal';

const mapErrorToMessage = () => TEXTS.compras.errors.generico;

export const ComprasPage = () => {
  const { empleado } = useAuth();
  const { idSucursalActiva } = useSucursalActiva();
  const { compras, isLoading, error, refetch, createCompra } = useCompras(idSucursalActiva);
  const { proveedores } = useProveedores();
  const { items: inventarioItems } = useInventario(idSucursalActiva);

  const handleExport = () =>
    exportToPdf({
      fileName: 'compras',
      title: TEXTS.compras.title,
      columns: [
        { header: TEXTS.compras.table.fecha, key: 'fecha' },
        { header: TEXTS.compras.table.proveedor, key: 'proveedor' },
        { header: TEXTS.compras.table.numeroFactura, key: 'factura' },
        { header: TEXTS.compras.table.items, key: 'items' },
        { header: TEXTS.compras.table.montoTotal, key: 'monto' },
        { header: TEXTS.compras.table.empleado, key: 'empleado' },
      ],
      rows: compras.map((compra) => ({
        fecha: formatFecha(compra.fecha_compra),
        proveedor: compra.proveedores?.razon_social ?? '',
        factura: compra.numero_factura ?? TEXTS.compras.sinFactura,
        items: compra.detalle_compra?.length ?? 0,
        monto: Number(compra.monto_total),
        empleado: compra.empleados ? `${compra.empleados.nombre} ${compra.empleados.apellido}` : '',
      })),
    });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const openCreate = () => {
    setSubmitError(null);
    setIsFormOpen(true);
  };

  const closeForm = () => setIsFormOpen(false);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await createCompra({ ...values, cedula_empleado: empleado.cedula });
      closeForm();
    } catch (err) {
      setSubmitError(mapErrorToMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <ComprasHeader total={compras.length} onCreate={openCreate} onExport={handleExport} />
      <ComprasTable compras={compras} isLoading={isLoading} error={error} onRetry={refetch} />

      <CompraFormModal
        open={isFormOpen}
        proveedores={proveedores}
        inventarioItems={inventarioItems}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />
    </div>
  );
};

export default ComprasPage;
