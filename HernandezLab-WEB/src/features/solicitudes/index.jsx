import { useMemo, useState } from 'react';
import { TEXTS } from '../../constants/texts';
import { useAuth } from '../../hooks/useAuth';
import { useSucursalActiva } from '../../hooks/useSucursalActiva';
import { useSolicitudes } from './hooks/useSolicitudes';
import { useExamenes } from './hooks/useExamenes';
import { usePacientes } from './hooks/usePacientes';
import { SolicitudesHeader } from './components/SolicitudesHeader';
import { SolicitudesTable } from './components/SolicitudesTable';
import { SolicitudFormModal } from './components/SolicitudFormModal';
import { ConfirmDeleteModal } from '../../components/common/ConfirmDeleteModal';
import { exportToPdf, formatFecha } from '../../utils/exportPdf';

const mapErrorToMessage = (error) => {
  if (error?.message?.toLowerCase().includes('stock')) return TEXTS.solicitudes.errors.stockInsuficiente;
  return TEXTS.solicitudes.errors.generico;
};

export const SolicitudesPage = () => {
  const { empleado } = useAuth();
  const { idSucursalActiva } = useSucursalActiva();
  const { solicitudes, isLoading, error, refetch, createSolicitud, deleteSolicitud } = useSolicitudes(idSucursalActiva);
  const { examenes } = useExamenes();
  const { createPaciente } = usePacientes();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [deletingSolicitud, setDeletingSolicitud] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const puedeEliminar = empleado?.rol === 'administrativo';

  const [search, setSearch] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('pendiente');

  const solicitudesFiltradas = useMemo(() => {
    const termino = search.trim().toLowerCase();
    return solicitudes.filter((solicitud) => {
      if (estadoFiltro !== 'todas' && solicitud.estado !== estadoFiltro) return false;
      if (!termino) return true;

      const nombre = `${solicitud.pacientes?.nombre ?? ''} ${solicitud.pacientes?.apellido ?? ''}`.toLowerCase();
      const cedula = (solicitud.pacientes?.cedula ?? '').toLowerCase();
      return nombre.includes(termino) || cedula.includes(termino);
    });
  }, [solicitudes, search, estadoFiltro]);

  const openCreate = () => {
    setSubmitError(null);
    setIsFormOpen(true);
  };

  const closeForm = () => setIsFormOpen(false);

  const handleSubmit = async ({ cedula, pacienteNuevo, examenIds }) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (pacienteNuevo) {
        await createPaciente(pacienteNuevo);
      }
      await createSolicitud({
        cedulaPaciente: cedula,
        cedulaEmpleado: empleado.cedula,
        examenIds,
      });
      closeForm();
    } catch (err) {
      console.error('Error al registrar la solicitud:', err);
      setSubmitError(mapErrorToMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = () =>
    exportToPdf({
      fileName: 'solicitudes',
      title: TEXTS.solicitudes.title,
      columns: [
        { header: TEXTS.solicitudes.table.fecha, key: 'fecha' },
        { header: TEXTS.solicitudes.form.cedulaLabel, key: 'cedula' },
        { header: TEXTS.solicitudes.table.paciente, key: 'paciente' },
        { header: TEXTS.solicitudes.table.examenes, key: 'examenes' },
        { header: TEXTS.solicitudes.table.estado, key: 'estado' },
        { header: TEXTS.solicitudes.table.total, key: 'total' },
      ],
      rows: solicitudesFiltradas.map((solicitud) => ({
        fecha: formatFecha(solicitud.fecha_solicitud),
        cedula: solicitud.pacientes?.cedula ?? solicitud.cedula_paciente,
        paciente: `${solicitud.pacientes?.nombre ?? ''} ${solicitud.pacientes?.apellido ?? ''}`.trim(),
        examenes: solicitud.detalle_solicitud?.map((d) => d.examenes?.nombre_examen).filter(Boolean).join(', '),
        estado: TEXTS.solicitudes.estados[solicitud.estado] ?? solicitud.estado,
        total: Number(solicitud.total_pagar),
      })),
    });

  const openDelete = (solicitud) => {
    setDeleteError(null);
    setDeletingSolicitud(solicitud);
  };

  const closeDelete = () => setDeletingSolicitud(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteSolicitud(deletingSolicitud.id_solicitud);
      closeDelete();
    } catch (err) {
      console.error('Error al eliminar la solicitud:', err);
      setDeleteError(TEXTS.solicitudes.errors.eliminar);
    } finally {
      setIsDeleting(false);
    }
  };

  const nombrePacienteEliminando = deletingSolicitud
    ? `${deletingSolicitud.pacientes?.nombre ?? ''} ${deletingSolicitud.pacientes?.apellido ?? ''}`.trim() ||
      deletingSolicitud.cedula_paciente
    : '';

  return (
    <div>
      <SolicitudesHeader
        total={solicitudesFiltradas.length}
        onCreate={openCreate}
        onExport={handleExport}
        search={search}
        onSearchChange={setSearch}
        estadoFiltro={estadoFiltro}
        onEstadoFiltroChange={setEstadoFiltro}
      />
      <SolicitudesTable
        solicitudes={solicitudesFiltradas}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        emptyMessage={search.trim() ? TEXTS.solicitudes.emptyFiltrado : undefined}
        onDelete={puedeEliminar ? openDelete : undefined}
      />

      <ConfirmDeleteModal
        open={Boolean(deletingSolicitud)}
        title={TEXTS.solicitudes.confirmDelete.title}
        message={TEXTS.solicitudes.confirmDelete.message(nombrePacienteEliminando)}
        confirmText={TEXTS.solicitudes.confirmDelete.confirm}
        cancelText={TEXTS.solicitudes.confirmDelete.cancel}
        isDeleting={isDeleting}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={closeDelete}
      />

      <SolicitudFormModal
        open={isFormOpen}
        examenes={examenes}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />
    </div>
  );
};

export default SolicitudesPage;
