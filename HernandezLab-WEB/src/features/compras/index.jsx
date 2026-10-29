import { useState } from 'react';
import { TEXTS } from '../../constants/texts';
import { useAuth } from '../../hooks/useAuth';
import { useSucursalActiva } from '../../hooks/useSucursalActiva';
import { useCompras } from './hooks/useCompras';
import { useProveedores } from '../proveedores/hooks/useProveedores';
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
      <ComprasHeader total={compras.length} onCreate={openCreate} />
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
