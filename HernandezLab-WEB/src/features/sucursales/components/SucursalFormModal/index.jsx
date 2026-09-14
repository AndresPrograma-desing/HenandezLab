import { useEffect, useState } from 'react';
import { TEXTS } from '../../../../constants/texts';
import { validateRequerido } from '../../../../utils/validators';
import DrawPanel from 'anteriority-ui/screens/components/DrawPanel/index';
import Input from 'anteriority-ui/screens/components/Input/index';
import Switch from 'anteriority-ui/screens/components/Swich/index';
import styles from './index.module.css';

const emptyValues = {
  nombre: '',
  direccion: '',
  telefono: '',
  activo: true,
};

export const SucursalFormModal = ({ open, sucursal, onSubmit, onCancel, isSubmitting = false, submitError = null }) => {
  const isEdit = Boolean(sucursal);
  const [values, setValues] = useState(emptyValues);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setFieldErrors({});
    setValues(
      sucursal
        ? {
            nombre: sucursal.nombre,
            direccion: sucursal.direccion ?? '',
            telefono: sucursal.telefono ?? '',
            activo: sucursal.activo,
          }
        : emptyValues
    );
  }, [open, sucursal]);

  const setField = (field) => (value) => setValues((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();

    const errors = {
      nombre: validateRequerido(values.nombre, TEXTS.sucursales.form.nombreLabel),
    };

    const hasErrors = Object.values(errors).some(Boolean);
    setFieldErrors(errors);
    if (hasErrors) return;

    onSubmit(values);
  };

  return (
    <DrawPanel
      isOpen={open}
      onClose={onCancel}
      title={isEdit ? TEXTS.sucursales.form.editTitle : TEXTS.sucursales.form.createTitle}
      showActions
      formId="sucursal-form"
      confirmText={isEdit ? TEXTS.sucursales.form.submitEdit : TEXTS.sucursales.form.submitCreate}
      cancelText={TEXTS.sucursales.form.cancel}
      loading={isSubmitting}
      formData={values}
    >
      <form id="sucursal-form" className={styles.form} onSubmit={handleSubmit}>
        <Input
          label={TEXTS.sucursales.form.nombreLabel}
          value={values.nombre}
          onChange={(event) => setField('nombre')(event.target.value)}
          error={fieldErrors.nombre}
          required
        />
        <Input
          label={TEXTS.sucursales.form.direccionLabel}
          value={values.direccion}
          onChange={(event) => setField('direccion')(event.target.value)}
        />
        <Input
          label={TEXTS.sucursales.form.telefonoLabel}
          value={values.telefono}
          onChange={(event) => setField('telefono')(event.target.value)}
        />

        <div className={styles.switchRow}>
          <span>{TEXTS.sucursales.form.estadoLabel}</span>
          <Switch value={values.activo} onChange={setField('activo')} />
        </div>

        {submitError && <p className={styles.error}>{submitError}</p>}
      </form>
    </DrawPanel>
  );
};

export default SucursalFormModal;
