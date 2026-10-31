import { useState } from 'react';
import { TEXTS } from '../../constants/texts';
import { useSucursalActiva } from '../../hooks/useSucursalActiva';
import { useInventario } from '../inventario/hooks/useInventario';
import { PreciosHeader } from './components/PreciosHeader';
import { PreciosTable } from './components/PreciosTable';
import { PrecioFormModal } from './components/PrecioFormModal';
import { exportToPdf } from '../../utils/exportPdf';

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

  const handleExport = () =>
    exportToPdf({
      fileName: 'precios',
      title: TEXTS.precios.title,
      columns: [
        { header: TEXTS.precios.table.codigo, key: 'codigo' },
        { header: TEXTS.precios.table.nombre, key: 'nombre' },
        { header: TEXTS.precios.table.categoria, key: 'categoria' },
        { header: TEXTS.precios.table.stockActual, key: 'stock_actual' },
        { header: TEXTS.precios.table.precio, key: 'precio' },
      ],
      rows: items.map((item) => ({
        codigo: item.codigo,
        nombre: item.nombre,
        categoria: item.categoria,
        stock_actual: Number(item.stock_actual),
        precio: item.precio != null ? Number(item.precio) : null,
      })),
    });

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
      <PreciosHeader total={items.length} onExport={handleExport} />
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
