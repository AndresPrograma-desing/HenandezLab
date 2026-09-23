import { useEffect, useState } from 'react';
import { TEXTS } from '../../../../constants/texts';
import { validateCedula, validateNombre, validateRequerido } from '../../../../utils/validators';
import { useDuplicateCheck } from '../../../../hooks/useDuplicateCheck';
import DrawPanel from 'anteriority-ui/screens/components/DrawPanel/index';
import Input from 'anteriority-ui/screens/components/Input/index';
import Selector from 'anteriority-ui/screens/components/Material-UI/Components/Selector/index';
import Switch from 'anteriority-ui/screens/components/Swich/index';
import styles from './index.module.css';

const emptyValues = {
  cedula: '',
  nombre: '',
  apellido: '',
  cargo: '',
  rol: '',
  id_sucursal: '',
  estado_activo: true,
};

const rolOptions = [
  { value: 'administrativo', label: TEXTS.roles.administrativo },
  { value: 'recepcion', label: TEXTS.roles.recepcion },
];

const cargoOptions = Object.entries(TEXTS.usuarios.cargos).map(([value, label]) => ({ value, label }));

export const UsuarioFormModal = ({
  open,
  usuario,
  sucursales,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitError = null,
}) => {
  const isEdit = Boolean(usuario);
  const [values, setValues] = useState(emptyValues);
  const [fieldErrors, setFieldErrors] = useState({});
  const { checkDuplicado } = useDuplicateCheck();

  useEffect(() => {
    if (!open) return;
    setFieldErrors({});
    setValues(
      usuario
        ? {
            cedula: usuario.cedula,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            cargo: usuario.cargo ?? '',
            rol: usuario.rol,
            id_sucursal: usuario.id_sucursal,
            estado_activo: usuario.estado_activo,
          }
        : emptyValues
    );
  }, [open, usuario]);

  const sucursalOptions = sucursales.map((s) => ({ value: s.id_sucursal, label: s.nombre }));

  const setField = (field) => (value) => setValues((prev) => ({ ...prev, [field]: value }));

  const handleCedulaBlur = async () => {
    if (isEdit) return;
    const cedulaError = validateCedula(values.cedula);
    if (cedulaError) return;

    const existe = await checkDuplicado('empleados', { cedula: values.cedula.trim() });
    if (existe) {
      setFieldErrors((prev) => ({ ...prev, cedula: TEXTS.usuarios.avisos.cedulaDuplicada }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {
      cedula: validateCedula(values.cedula),
      nombre: validateNombre(values.nombre, TEXTS.usuarios.form.nombreLabel),
      apellido: validateNombre(values.apellido, TEXTS.usuarios.form.apellidoLabel),
      cargo: validateRequerido(values.cargo, TEXTS.usuarios.form.cargoLabel),
      rol: validateRequerido(values.rol, TEXTS.usuarios.form.rolLabel),
      id_sucursal: validateRequerido(values.id_sucursal, TEXTS.usuarios.form.sucursalLabel),
    };

    if (!isEdit && !errors.cedula) {
      const existe = await checkDuplicado('empleados', { cedula: values.cedula.trim() });
      if (existe) errors.cedula = TEXTS.usuarios.avisos.cedulaDuplicada;
    }

    const hasErrors = Object.values(errors).some(Boolean);
    setFieldErrors(errors);
    if (hasErrors) return;

    onSubmit(values);
  };

  return (
    <DrawPanel
      isOpen={open}
      onClose={onCancel}
      title={isEdit ? TEXTS.usuarios.form.editTitle : TEXTS.usuarios.form.createTitle}
      showActions
      formId="usuario-form"
      confirmText={isEdit ? TEXTS.usuarios.form.submitEdit : TEXTS.usuarios.form.submitCreate}
      cancelText={TEXTS.usuarios.form.cancel}
      loading={isSubmitting}
      formData={values}
    >
      <form id="usuario-form" className={styles.form} onSubmit={handleSubmit}>
        <Input
          label={TEXTS.usuarios.form.cedulaLabel}
          value={values.cedula}
          onChange={(event) => setField('cedula')(event.target.value)}
          onBlur={handleCedulaBlur}
          error={fieldErrors.cedula}
          helperText={!fieldErrors.cedula ? TEXTS.usuarios.form.cedulaHelper : undefined}
          disabled={isEdit}
          required
        />
        <Input
          label={TEXTS.usuarios.form.nombreLabel}
          value={values.nombre}
          onChange={(event) => setField('nombre')(event.target.value)}
          error={fieldErrors.nombre}
          required
        />
        <Input
          label={TEXTS.usuarios.form.apellidoLabel}
          value={values.apellido}
          onChange={(event) => setField('apellido')(event.target.value)}
          error={fieldErrors.apellido}
          required
        />
        <Selector
          id="usuario-cargo"
          label={TEXTS.usuarios.form.cargoLabel}
          options={cargoOptions}
          value={values.cargo}
          onChange={(event) => setField('cargo')(event.target.value)}
          required
        />
        {fieldErrors.cargo && <p className={styles.selectError}>{fieldErrors.cargo}</p>}
        <Selector
          id="usuario-rol"
          label={TEXTS.usuarios.form.rolLabel}
          options={rolOptions}
          value={values.rol}
          onChange={(event) => setField('rol')(event.target.value)}
          required
        />
        {fieldErrors.rol && <p className={styles.selectError}>{fieldErrors.rol}</p>}
        <Selector
          id="usuario-sucursal"
          label={TEXTS.usuarios.form.sucursalLabel}
          options={sucursalOptions}
          value={values.id_sucursal}
          onChange={(event) => setField('id_sucursal')(event.target.value)}
          required
        />
        {fieldErrors.id_sucursal && <p className={styles.selectError}>{fieldErrors.id_sucursal}</p>}

        <div className={styles.switchRow}>
          <span>{TEXTS.usuarios.form.estadoLabel}</span>
          <Switch value={values.estado_activo} onChange={setField('estado_activo')} />
        </div>

        <p className={styles.note}>{TEXTS.usuarios.form.loginNote}</p>

        {submitError && <p className={styles.error}>{submitError}</p>}
      </form>
    </DrawPanel>
  );
};

export default UsuarioFormModal;
