import { useMemo, useState } from 'react';
import { TEXTS } from '../../constants/texts';
import { useSucursalActiva } from '../../hooks/useSucursalActiva';
import { useInventario } from './hooks/useInventario';
import { useProveedores } from '../proveedores/hooks/useProveedores';
import { InventarioHeader } from './components/InventarioHeader';
import { CategoriaTabs } from './components/CategoriaTabs';
import { InventarioTable } from './components/InventarioTable';
import { InventarioFormModal } from './components/InventarioFormModal';
import { StockMovimientoModal } from './components/StockMovimientoModal';
import { ConfirmDeleteModal } from '../../components/common/ConfirmDeleteModal';

const mapErrorToMessage = (error) => {
  if (error?.code === '23505') return TEXTS.inventario.errors.codigoDuplicado;
  if (error?.message === 'stock_insuficiente') return TEXTS.inventario.errors.stockInsuficiente;
  return TEXTS.inventario.errors.generico;
};

export const InventarioPage = () => {
  const { idSucursalActiva } = useSucursalActiva();
  const { items, isLoading, error, refetch, createItem, updateItem, deleteItem, registrarMovimiento } =
    useInventario(idSucursalActiva);
  const { proveedores } = useProveedores();

  const [categoriaActiva, setCategoriaActiva] = useState('insumos');
  const [editingItem, setEditingItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const [movimiento, setMovimiento] = useState(null); // { item, tipo }
  const [isMovimientoSubmitting, setIsMovimientoSubmitting] = useState(false);
  const [movimientoError, setMovimientoError] = useState(null);

  const itemsFiltrados = useMemo(
    () => items.filter((item) => item.categoria === categoriaActiva),
    [items, categoriaActiva]
  );

  const openCreate = () => {
    setEditingItem(null);
    setSubmitError(null);
    setIsFormOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setSubmitError(null);
    setIsFormOpen(true);
  };

  const closeForm = () => setIsFormOpen(false);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (editingItem) {
        await updateItem(editingItem.id_item, values);
      } else {
        await createItem(values);
      }
      closeForm();
    } catch (err) {
      setSubmitError(mapErrorToMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeDelete = () => setDeletingItem(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteItem(deletingItem.id_item);
      closeDelete();
    } catch (err) {
      setDeleteError(mapErrorToMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const closeMovimiento = () => setMovimiento(null);

  const handleMovimientoSubmit = async (values) => {
    setIsMovimientoSubmitting(true);
    setMovimientoError(null);
    try {
      await registrarMovimiento(movimiento.item, values);
      closeMovimiento();
    } catch (err) {
      setMovimientoError(mapErrorToMessage(err));
    } finally {
      setIsMovimientoSubmitting(false);
    }
  };

  return (
    <div>
      <InventarioHeader total={itemsFiltrados.length} onCreate={openCreate} />
      <CategoriaTabs value={categoriaActiva} onChange={setCategoriaActiva} />
      <InventarioTable
        items={itemsFiltrados}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        onEdit={openEdit}
        onDelete={setDeletingItem}
        onRegistrarCompra={(item) => setMovimiento({ item, tipo: 'compra' })}
        onSacarStock={(item) => setMovimiento({ item, tipo: 'salida' })}
      />

      <InventarioFormModal
        open={isFormOpen}
        item={editingItem}
        categoriaActiva={categoriaActiva}
        proveedores={proveedores}
        idSucursalActiva={idSucursalActiva}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />

      <StockMovimientoModal
        open={Boolean(movimiento)}
        item={movimiento?.item ?? null}
        tipo={movimiento?.tipo}
        onSubmit={handleMovimientoSubmit}
        onCancel={closeMovimiento}
        isSubmitting={isMovimientoSubmitting}
        submitError={movimientoError}
      />

      <ConfirmDeleteModal
        open={Boolean(deletingItem)}
        title={TEXTS.inventario.confirmDelete.title}
        message={deletingItem ? TEXTS.inventario.confirmDelete.message(deletingItem.nombre) : ''}
        confirmText={TEXTS.inventario.confirmDelete.confirm}
        cancelText={TEXTS.inventario.confirmDelete.cancel}
        isDeleting={isDeleting}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={closeDelete}
      />
    </div>
  );
};

export default InventarioPage;
