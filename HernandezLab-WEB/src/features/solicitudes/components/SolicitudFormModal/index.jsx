import { useEffect, useMemo, useState } from 'react';
import { TEXTS } from '../../../../constants/texts';
import { validateCedula, validateNombre, validateFecha, validateGenero } from '../../../../utils/validators';
import { supabase } from '../../../../lib/supabaseClient';
import { usePacientes } from '../../hooks/usePacientes';
import { PacienteFields } from './components/PacienteFields';
import { ExamenesChecklist } from './components/ExamenesChecklist';
import DrawPanel from 'anteriority-ui/screens/components/DrawPanel/index';
import styles from './index.module.css';

const emptyValues = {
  cedula: '',
  nombre: '',
  apellido: '',
  fecha_nacimiento: '',
  genero: '',
};

export const SolicitudFormModal = ({ open, examenes, onSubmit, onCancel, isSubmitting = false, submitError = null }) => {
  const { findByCedula } = usePacientes();

  const [values, setValues] = useState(emptyValues);
  const [fieldErrors, setFieldErrors] = useState({});
  const [pacienteEncontrado, setPacienteEncontrado] = useState(null);
  const [selectedExamenes, setSelectedExamenes] = useState([]);
  const [consumoPreview, setConsumoPreview] = useState([]);

  useEffect(() => {
    if (!open) return;
    setValues(emptyValues);
    setFieldErrors({});
    setPacienteEncontrado(null);
    setSelectedExamenes([]);
    setConsumoPreview([]);
  }, [open]);

  useEffect(() => {
    if (selectedExamenes.length === 0) {
      setConsumoPreview([]);
      return;
    }

    let active = true;
    supabase
      .from('reactivos_por_examen')
      .select('cantidad_requerida, inventario(nombre)')
      .in('id_examen', selectedExamenes)
      .then(({ data }) => {
        if (!active) return;
        setConsumoPreview(
          (data ?? []).map((row) => ({ nombre: row.inventario?.nombre ?? '—', cantidad: row.cantidad_requerida }))
        );
      });

    return () => {
      active = false;
    };
  }, [selectedExamenes]);

  const total = useMemo(
    () => examenes.filter((e) => selectedExamenes.includes(e.id_examen)).reduce((sum, e) => sum + Number(e.precio), 0),
    [examenes, selectedExamenes]
  );

  const setField = (field) => (value) => setValues((prev) => ({ ...prev, [field]: value }));

  const handleCedulaBlur = async () => {
    const cedulaError = validateCedula(values.cedula);
    if (cedulaError) return;

    const paciente = await findByCedula(values.cedula.trim());
    if (paciente) {
      setPacienteEncontrado(paciente);
      setValues((prev) => ({
        ...prev,
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        fecha_nacimiento: paciente.fecha_nacimiento,
        genero: paciente.genero,
      }));
    } else {
      setPacienteEncontrado(false);
    }
  };

  const toggleExamen = (idExamen) => {
    setSelectedExamenes((prev) => (prev.includes(idExamen) ? prev.filter((id) => id !== idExamen) : [...prev, idExamen]));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const errors = {
      cedula: validateCedula(values.cedula),
      nombre: validateNombre(values.nombre, TEXTS.solicitudes.form.nombreLabel),
      apellido: validateNombre(values.apellido, TEXTS.solicitudes.form.apellidoLabel),
      fecha_nacimiento: validateFecha(values.fecha_nacimiento, { noFuture: true }),
      genero: validateGenero(values.genero),
    };

    if (selectedExamenes.length === 0) {
      errors.examenes = TEXTS.solicitudes.errors.seleccionaExamen;
    }

    const hasErrors = Object.values(errors).some(Boolean);
    setFieldErrors(errors);
    if (hasErrors) return;

    onSubmit({
      cedula: values.cedula.trim(),
      pacienteNuevo: pacienteEncontrado
        ? null
        : {
            cedula: values.cedula.trim(),
            nombre: values.nombre.trim(),
            apellido: values.apellido.trim(),
            fecha_nacimiento: values.fecha_nacimiento,
            genero: values.genero,
          },
      examenIds: selectedExamenes,
    });
  };

  return (
    <DrawPanel
      isOpen={open}
      onClose={onCancel}
      title={TEXTS.solicitudes.form.createTitle}
      showActions
      formId="solicitud-form"
      confirmText={TEXTS.solicitudes.form.submitCreate}
      cancelText={TEXTS.solicitudes.form.cancel}
      loading={isSubmitting}
      formData={values}
      width="480px"
    >
      <form id="solicitud-form" className={styles.form} onSubmit={handleSubmit}>
        <PacienteFields
          values={values}
          fieldErrors={fieldErrors}
          pacienteEncontrado={pacienteEncontrado}
          onCedulaBlur={handleCedulaBlur}
          onFieldChange={setField}
        />

        <ExamenesChecklist
          examenes={examenes}
          selectedIds={selectedExamenes}
          onToggle={toggleExamen}
          consumoPreview={consumoPreview}
          total={total}
        />
        {fieldErrors.examenes && <p className={styles.error}>{fieldErrors.examenes}</p>}

        {submitError && <p className={styles.error}>{submitError}</p>}
      </form>
    </DrawPanel>
  );
};

export default SolicitudFormModal;
