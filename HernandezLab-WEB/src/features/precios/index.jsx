import { useState } from 'react';
import { TEXTS } from '../../constants/texts';
import { useSucursalActiva } from '../../hooks/useSucursalActiva';
import { useInventario } from '../inventario/hooks/useInventario';
import { PreciosHeader } from './components/PreciosHeader';
import { PreciosTable } from './components/PreciosTable';
import { PrecioFormModal } from './components/PrecioFormModal';

const mapErrorToMessage = () => TEXTS.precios.errors.generico;

/**
 * Módulo independiente para gestionar los precios del inventario de la
 * sucursal activa, separado de la administración de stock (Inventario).
 */
export const PreciosPage = () => {
  const { idSucursalActiva } = useSucursalActiva();
  const { items, isLoading, error, refetch, updateItem } = useInventario(idSucursalActiva);

  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const closeForm = () => setEditingItem(null);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await updateItem(editingItem.id_item, values);
      closeForm();
    } catch (err) {
      setSubmitError(mapErrorToMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PreciosHeader total={items.length} />
      <PreciosTable items={items} isLoading={isLoading} error={error} onRetry={refetch} onEdit={setEditingItem} />

      <PrecioFormModal
        open={Boolean(editingItem)}
        item={editingItem}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />
    </div>
  );
};

export default PreciosPage;
