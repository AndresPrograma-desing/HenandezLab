import { useState } from 'react';
import { TEXTS } from '../../constants/texts';
import { useAuth } from '../../hooks/useAuth';
import { useSucursalActiva } from '../../hooks/useSucursalActiva';
import { useSolicitudes } from './hooks/useSolicitudes';
import { useExamenes } from './hooks/useExamenes';
import { usePacientes } from './hooks/usePacientes';
import { SolicitudesHeader } from './components/SolicitudesHeader';
import { SolicitudesTable } from './components/SolicitudesTable';
import { SolicitudFormModal } from './components/SolicitudFormModal';

const mapErrorToMessage = (error) => {
  if (error?.message?.toLowerCase().includes('stock')) return TEXTS.solicitudes.errors.stockInsuficiente;
  return TEXTS.solicitudes.errors.generico;
};

export const SolicitudesPage = () => {
  const { empleado } = useAuth();
  const { idSucursalActiva } = useSucursalActiva();
  const { solicitudes, isLoading, error, refetch, createSolicitud } = useSolicitudes(idSucursalActiva);
  const { examenes } = useExamenes();
  const { createPaciente } = usePacientes();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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
      setSubmitError(mapErrorToMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <SolicitudesHeader total={solicitudes.length} onCreate={openCreate} />
      <SolicitudesTable solicitudes={solicitudes} isLoading={isLoading} error={error} onRetry={refetch} />

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
