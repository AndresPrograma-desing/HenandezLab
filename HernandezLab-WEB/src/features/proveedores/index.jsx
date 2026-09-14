import { useState } from 'react';
import { TEXTS } from '../../constants/texts';
import { useProveedores } from './hooks/useProveedores';
import { ProveedoresHeader } from './components/ProveedoresHeader';
import { ProveedoresTable } from './components/ProveedoresTable';
import { ProveedorFormModal } from './components/ProveedorFormModal';
import { ConfirmDeleteModal } from '../../components/common/ConfirmDeleteModal';

const mapErrorToMessage = (error) => {
  if (error?.code === '23505') return TEXTS.proveedores.errors.rifDuplicado;
  return TEXTS.proveedores.errors.generico;
};

export const ProveedoresPage = () => {
  const { proveedores, isLoading, error, refetch, createProveedor, updateProveedor, deleteProveedor } = useProveedores();

  const [editingProveedor, setEditingProveedor] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [deletingProveedor, setDeletingProveedor] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const openCreate = () => {
    setEditingProveedor(null);
    setSubmitError(null);
    setIsFormOpen(true);
  };

  const openEdit = (proveedor) => {
    setEditingProveedor(proveedor);
    setSubmitError(null);
    setIsFormOpen(true);
  };

  const closeForm = () => setIsFormOpen(false);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (editingProveedor) {
        const { rif_cedula: _rif_cedula, ...changes } = values;
        await updateProveedor(editingProveedor.id_proveedor, changes);
      } else {
        await createProveedor(values);
      }
      closeForm();
    } catch (err) {
      setSubmitError(mapErrorToMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeDelete = () => setDeletingProveedor(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteProveedor(deletingProveedor.id_proveedor);
      closeDelete();
    } catch (err) {
      setDeleteError(mapErrorToMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <ProveedoresHeader total={proveedores.length} onCreate={openCreate} />
      <ProveedoresTable
        proveedores={proveedores}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        onEdit={openEdit}
        onDelete={setDeletingProveedor}
      />

      <ProveedorFormModal
        open={isFormOpen}
        proveedor={editingProveedor}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />

      <ConfirmDeleteModal
        open={Boolean(deletingProveedor)}
        title={TEXTS.proveedores.confirmDelete.title}
        message={deletingProveedor ? TEXTS.proveedores.confirmDelete.message(deletingProveedor.razon_social) : ''}
        confirmText={TEXTS.proveedores.confirmDelete.confirm}
        cancelText={TEXTS.proveedores.confirmDelete.cancel}
        isDeleting={isDeleting}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={closeDelete}
      />
    </div>
  );
};

export default ProveedoresPage;
