import { useState } from 'react';
import { TEXTS } from '../../constants/texts';
import { useSucursalActiva } from '../../hooks/useSucursalActiva';
import { useUsuarios } from './hooks/useUsuarios';
import { useSucursales } from '../sucursales/hooks/useSucursales';
import { UsuariosHeader } from './components/UsuariosHeader';
import { UsuariosTable } from './components/UsuariosTable';
import { UsuarioFormModal } from './components/UsuarioFormModal';
import { CredencialesModal } from './components/CredencialesModal';
import { ResetPasswordModal } from './components/ResetPasswordModal';
import { ConfirmDeleteModal } from '../../components/common/ConfirmDeleteModal';
import { exportToPdf, formatFecha } from '../../utils/exportPdf';

const mapErrorToMessage = (error) => {
  if (error?.code === '23505') return TEXTS.usuarios.errors.cedulaDuplicada;
  if (error?.message?.includes('already been registered')) return TEXTS.usuarios.errors.emailDuplicado;
  if (error?.message === 'Ya existe un empleado con esa cédula') return TEXTS.usuarios.errors.cedulaDuplicada;
  if (error?.message) return error.message;
  return TEXTS.usuarios.errors.generico;
};

export const UsuariosPage = () => {
  const { idSucursalActiva } = useSucursalActiva();
  const { usuarios, isLoading, error, refetch, createUsuario, updateUsuario, deleteUsuario, resetearPassword } =
    useUsuarios(idSucursalActiva);
  const { sucursales } = useSucursales();

  const [editingUsuario, setEditingUsuario] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [deletingUsuario, setDeletingUsuario] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const [credencialesInfo, setCredencialesInfo] = useState(null);

  const [resettingUsuario, setResettingUsuario] = useState(null);
  const [isResetting, setIsResetting] = useState(false);
  const [resetError, setResetError] = useState(null);

  const handleExport = () =>
    exportToPdf({
      fileName: 'usuarios',
      title: TEXTS.usuarios.title,
      columns: [
        { header: TEXTS.usuarios.table.cedula, key: 'cedula' },
        { header: TEXTS.usuarios.table.nombre, key: 'nombre' },
        { header: TEXTS.usuarios.table.apellido, key: 'apellido' },
        { header: TEXTS.usuarios.table.cargo, key: 'cargo' },
        { header: TEXTS.usuarios.table.rol, key: 'rol' },
        { header: TEXTS.usuarios.table.sucursal, key: 'sucursal' },
        { header: TEXTS.usuarios.table.estado, key: 'estado' },
      ],
      rows: usuarios.map((usuario) => ({
        cedula: usuario.cedula,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        cargo: TEXTS.usuarios.cargos[usuario.cargo] ?? usuario.cargo,
        rol: TEXTS.roles[usuario.rol] ?? usuario.rol,
        sucursal: usuario.sucursales?.nombre ?? '',
        estado: usuario.estado_activo ? TEXTS.comun.activo : TEXTS.comun.inactivo,
      })),
    });

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
        setCredencialesInfo({
          title: TEXTS.usuarios.form.accesoSectionTitle,
          message: TEXTS.usuarios.form.credencialesNota(values.email, values.password),
        });
      }
      closeForm();
    } catch (err) {
      setSubmitError(mapErrorToMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeReset = () => setResettingUsuario(null);

  const handleResetPassword = async (password) => {
    setIsResetting(true);
    setResetError(null);
    try {
      await resetearPassword(resettingUsuario.cedula, password);
      setCredencialesInfo({
        title: TEXTS.usuarios.resetPassword.title(`${resettingUsuario.nombre} ${resettingUsuario.apellido}`),
        message: TEXTS.usuarios.resetPassword.credencialesNota(password),
      });
      closeReset();
    } catch (err) {
      setResetError(mapErrorToMessage(err));
    } finally {
      setIsResetting(false);
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
      <UsuariosHeader total={usuarios.length} onCreate={openCreate} onExport={handleExport} />
      <UsuariosTable
        usuarios={usuarios}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        onEdit={openEdit}
        onDelete={setDeletingUsuario}
        onResetPassword={setResettingUsuario}
      />

      <UsuarioFormModal
        open={isFormOpen}
        usuario={editingUsuario}
        sucursales={sucursales}
        defaultSucursalId={idSucursalActiva}
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

      <ResetPasswordModal
        usuario={resettingUsuario}
        onSubmit={handleResetPassword}
        onCancel={closeReset}
        isSubmitting={isResetting}
        submitError={resetError}
      />

      <CredencialesModal info={credencialesInfo} onClose={() => setCredencialesInfo(null)} />
    </div>
  );
};

export default UsuariosPage;
