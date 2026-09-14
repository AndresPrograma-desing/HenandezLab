import { useEffect, useState } from 'react';
import { TEXTS } from '../../../../constants/texts';
import { validateRequerido } from '../../../../utils/validators';
import DrawPanel from 'anteriority-ui/screens/components/DrawPanel/index';
import Input from 'anteriority-ui/screens/components/Input/index';
import styles from './index.module.css';

const emptyValues = {
  rif_cedula: '',
  razon_social: '',
  persona_contacto: '',
  telefono: '',
};

export const ProveedorFormModal = ({ open, proveedor, onSubmit, onCancel, isSubmitting = false, submitError = null }) => {
  const isEdit = Boolean(proveedor);
  const [values, setValues] = useState(emptyValues);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setFieldErrors({});
    setValues(
      proveedor
        ? {
            rif_cedula: proveedor.rif_cedula,
            razon_social: proveedor.razon_social,
            persona_contacto: proveedor.persona_contacto ?? '',
            telefono: proveedor.telefono ?? '',
          }
        : emptyValues
    );
  }, [open, proveedor]);

  const setField = (field) => (value) => setValues((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();

    const errors = {
      rif_cedula: validateRequerido(values.rif_cedula, TEXTS.proveedores.form.rifLabel),
      razon_social: validateRequerido(values.razon_social, TEXTS.proveedores.form.razonSocialLabel),
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
      title={isEdit ? TEXTS.proveedores.form.editTitle : TEXTS.proveedores.form.createTitle}
      showActions
      formId="proveedor-form"
      confirmText={isEdit ? TEXTS.proveedores.form.submitEdit : TEXTS.proveedores.form.submitCreate}
      cancelText={TEXTS.proveedores.form.cancel}
      loading={isSubmitting}
      formData={values}
    >
      <form id="proveedor-form" className={styles.form} onSubmit={handleSubmit}>
        <Input
          label={TEXTS.proveedores.form.rifLabel}
          value={values.rif_cedula}
          onChange={(event) => setField('rif_cedula')(event.target.value)}
          error={fieldErrors.rif_cedula}
          disabled={isEdit}
          required
        />
        <Input
          label={TEXTS.proveedores.form.razonSocialLabel}
          value={values.razon_social}
          onChange={(event) => setField('razon_social')(event.target.value)}
          error={fieldErrors.razon_social}
          required
        />
        <Input
          label={TEXTS.proveedores.form.contactoLabel}
          value={values.persona_contacto}
          onChange={(event) => setField('persona_contacto')(event.target.value)}
        />
        <Input
          label={TEXTS.proveedores.form.telefonoLabel}
          value={values.telefono}
          onChange={(event) => setField('telefono')(event.target.value)}
        />

        {submitError && <p className={styles.error}>{submitError}</p>}
      </form>
    </DrawPanel>
  );
};

export default ProveedorFormModal;
