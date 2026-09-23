import { useEffect, useState } from 'react';
import { TEXTS } from '../../../../constants/texts';
import { validateNumero } from '../../../../utils/validators';
import DrawPanel from 'anteriority-ui/screens/components/DrawPanel/index';
import Input from 'anteriority-ui/screens/components/Input/index';
import styles from './index.module.css';

export const PrecioFormModal = ({ open, item, onSubmit, onCancel, isSubmitting = false, submitError = null }) => {
  const [precio, setPrecio] = useState('');
  const [fieldError, setFieldError] = useState(null);

  useEffect(() => {
    if (!open) return;
    setPrecio(item?.precio != null ? String(item.precio) : '');
    setFieldError(null);
  }, [open, item]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const error = validateNumero(precio, TEXTS.precios.form.precioLabel, { min: 0 });
    setFieldError(error);
    if (error) return;

    onSubmit({ precio: Number(precio) });
  };

  return (
    <DrawPanel
      isOpen={open}
      onClose={onCancel}
      title={item ? TEXTS.precios.form.editTitle(item.nombre) : ''}
      showActions
      formId="precio-form"
      confirmText={TEXTS.precios.form.submitEdit}
      cancelText={TEXTS.precios.form.cancel}
      loading={isSubmitting}
      formData={{ precio }}
    >
      <form id="precio-form" className={styles.form} onSubmit={handleSubmit}>
        <Input
          label={TEXTS.precios.form.precioLabel}
          type="number"
          value={precio}
          onChange={(event) => setPrecio(event.target.value)}
          error={fieldError}
          required
        />

        {submitError && <p className={styles.error}>{submitError}</p>}
      </form>
    </DrawPanel>
  );
};

export default PrecioFormModal;
