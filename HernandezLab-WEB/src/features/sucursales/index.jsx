import { useState } from 'react';
import { TEXTS } from '../../constants/texts';
import { useSucursales } from './hooks/useSucursales';
import { SucursalesHeader } from './components/SucursalesHeader';
import { SucursalesTable } from './components/SucursalesTable';
import { SucursalFormModal } from './components/SucursalFormModal';
import { ConfirmDeleteModal } from '../../components/common/ConfirmDeleteModal';

const mapErrorToMessage = () => TEXTS.sucursales.errors.generico;

export const SucursalesPage = () => {
  const { sucursales, isLoading, error, refetch, createSucursal, updateSucursal, deleteSucursal } = useSucursales();

  const [editingSucursal, setEditingSucursal] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [deletingSucursal, setDeletingSucursal] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const openCreate = () => {
    setEditingSucursal(null);
    setSubmitError(null);
    setIsFormOpen(true);
  };

  const openEdit = (sucursal) => {
    setEditingSucursal(sucursal);
    setSubmitError(null);
    setIsFormOpen(true);
  };

  const closeForm = () => setIsFormOpen(false);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (editingSucursal) {
        await updateSucursal(editingSucursal.id_sucursal, values);
      } else {
        await createSucursal(values);
      }
      closeForm();
    } catch (err) {
      setSubmitError(mapErrorToMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeDelete = () => setDeletingSucursal(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteSucursal(deletingSucursal.id_sucursal);
      closeDelete();
    } catch (err) {
      setDeleteError(mapErrorToMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <SucursalesHeader total={sucursales.length} onCreate={openCreate} />
      <SucursalesTable
        sucursales={sucursales}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        onEdit={openEdit}
        onDelete={setDeletingSucursal}
      />

      <SucursalFormModal
        open={isFormOpen}
        sucursal={editingSucursal}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />

      <ConfirmDeleteModal
        open={Boolean(deletingSucursal)}
        title={TEXTS.sucursales.confirmDelete.title}
        message={deletingSucursal ? TEXTS.sucursales.confirmDelete.message(deletingSucursal.nombre) : ''}
        confirmText={TEXTS.sucursales.confirmDelete.confirm}
        cancelText={TEXTS.sucursales.confirmDelete.cancel}
        isDeleting={isDeleting}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={closeDelete}
      />
    </div>
  );
};

export default SucursalesPage;
