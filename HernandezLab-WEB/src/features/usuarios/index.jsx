import { useState } from 'react';
import { TEXTS } from '../../constants/texts';
import { useUsuarios } from './hooks/useUsuarios';
import { useSucursales } from '../sucursales/hooks/useSucursales';
import { UsuariosHeader } from './components/UsuariosHeader';
import { UsuariosTable } from './components/UsuariosTable';
import { UsuarioFormModal } from './components/UsuarioFormModal';
import { ConfirmDeleteModal } from '../../components/common/ConfirmDeleteModal';

const mapErrorToMessage = (error) => {
  if (error?.code === '23505') return TEXTS.usuarios.errors.cedulaDuplicada;
  return TEXTS.usuarios.errors.generico;
};

export const UsuariosPage = () => {
  const { usuarios, isLoading, error, refetch, createUsuario, updateUsuario, deleteUsuario } = useUsuarios();
  const { sucursales } = useSucursales();

  const [editingUsuario, setEditingUsuario] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [deletingUsuario, setDeletingUsuario] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const openCreate = () => {
    setEditingUsuario(null);
    setSubmitError(null);
    setIsFormOpen(true);
  };

  const openEdit = (usuario) => {
    setEditingUsuario(usuario);
    setSubmitError(null);
    setIsFormOpen(true);
  };

  const closeForm = () => setIsFormOpen(false);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (editingUsuario) {
        const { cedula: _cedula, ...changes } = values;
        await updateUsuario(editingUsuario.cedula, changes);
      } else {
        await createUsuario(values);
      }
      closeForm();
    } catch (err) {
      setSubmitError(mapErrorToMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeDelete = () => setDeletingUsuario(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteUsuario(deletingUsuario.cedula);
      closeDelete();
    } catch (err) {
      setDeleteError(mapErrorToMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <UsuariosHeader total={usuarios.length} onCreate={openCreate} />
      <UsuariosTable
        usuarios={usuarios}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        onEdit={openEdit}
        onDelete={setDeletingUsuario}
      />

      <UsuarioFormModal
        open={isFormOpen}
        usuario={editingUsuario}
        sucursales={sucursales}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />

      <ConfirmDeleteModal
        open={Boolean(deletingUsuario)}
        title={TEXTS.usuarios.confirmDelete.title}
        message={deletingUsuario ? TEXTS.usuarios.confirmDelete.message(`${deletingUsuario.nombre} ${deletingUsuario.apellido}`) : ''}
        confirmText={TEXTS.usuarios.confirmDelete.confirm}
        cancelText={TEXTS.usuarios.confirmDelete.cancel}
        isDeleting={isDeleting}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={closeDelete}
      />
    </div>
  );
};

export default UsuariosPage;
