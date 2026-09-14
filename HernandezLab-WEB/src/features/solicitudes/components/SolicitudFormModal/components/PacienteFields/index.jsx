import { TEXTS } from '../../../../../../constants/texts';
import Input from 'anteriority-ui/screens/components/Input/index';
import Selector from 'anteriority-ui/screens/components/Material-UI/Components/Selector/index';
import styles from './index.module.css';

const generoOptions = [
  { value: 'M', label: 'M' },
  { value: 'F', label: 'F' },
];

export const PacienteFields = ({ values, fieldErrors, pacienteEncontrado, onCedulaBlur, onFieldChange }) => {
  const disabled = Boolean(pacienteEncontrado);

  return (
    <div className={styles.section}>
      <h4>{TEXTS.solicitudes.form.pacienteSectionTitle}</h4>

      <Input
        label={TEXTS.solicitudes.form.cedulaLabel}
        value={values.cedula}
        onChange={(event) => onFieldChange('cedula')(event.target.value)}
        onBlur={onCedulaBlur}
        error={fieldErrors.cedula}
        required
      />

      {pacienteEncontrado && <p className={styles.note}>{TEXTS.solicitudes.form.pacienteExistenteNota}</p>}

      <Input
        label={TEXTS.solicitudes.form.nombreLabel}
        value={values.nombre}
        onChange={(event) => onFieldChange('nombre')(event.target.value)}
        error={fieldErrors.nombre}
        disabled={disabled}
        required
      />
      <Input
        label={TEXTS.solicitudes.form.apellidoLabel}
        value={values.apellido}
        onChange={(event) => onFieldChange('apellido')(event.target.value)}
        error={fieldErrors.apellido}
        disabled={disabled}
        required
      />
      <Input
        label={TEXTS.solicitudes.form.fechaNacimientoLabel}
        type="date"
        value={values.fecha_nacimiento}
        onChange={(event) => onFieldChange('fecha_nacimiento')(event.target.value)}
        error={fieldErrors.fecha_nacimiento}
        disabled={disabled}
        InputLabelProps={{ shrink: true }}
        required
      />
      <Selector
        id="solicitud-genero"
        label={TEXTS.solicitudes.form.generoLabel}
        options={generoOptions}
        value={values.genero}
        onChange={(event) => onFieldChange('genero')(event.target.value)}
        disableClearable
        required
      />
      {fieldErrors.genero && <p className={styles.error}>{fieldErrors.genero}</p>}
    </div>
  );
};

export default PacienteFields;
