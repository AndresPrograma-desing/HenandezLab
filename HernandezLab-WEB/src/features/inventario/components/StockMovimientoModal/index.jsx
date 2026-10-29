import { useEffect, useState } from 'react';
import { TEXTS } from '../../../../constants/texts';
import { validateNumero } from '../../../../utils/validators';
import DrawPanel from 'anteriority-ui/screens/components/DrawPanel/index';
import Input from 'anteriority-ui/screens/components/Input/index';
import styles from './index.module.css';

const emptyValues = {
  cantidad: '',
  motivo: '',
};

/**
 * Registra una salida de stock (merma, uso manual, etc.) de un ítem de
 * inventario. Las entradas (compras) se registran siempre desde la pantalla
 * de Compras, que alimenta el historial de lotes.
 */
export const StockMovimientoModal = ({ open, item, onSubmit, onCancel, isSubmitting = false, submitError = null }) => {
  const [values, setValues] = useState(emptyValues);
  const [fieldErrors, setFieldErrors] = useState({});

  const textos = TEXTS.inventario.movimientos;

  useEffect(() => {
    if (!open) return;
    setValues(emptyValues);
    setFieldErrors({});
  }, [open, item]);

  const setField = (field) => (value) => setValues((prev) => ({ ...prev, [field]: value }));

  const cantidadNumero = Number(values.cantidad) || 0;
  const stockResultante = item ? Number(item.stock_actual) - cantidadNumero : null;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!item) return;

    const errors = {
      cantidad: validateNumero(values.cantidad, textos.cantidadLabel, { min: 0.0001 }),
    };

    if (!errors.cantidad && cantidadNumero > Number(item.stock_actual)) {
      errors.cantidad = TEXTS.inventario.errors.stockInsuficiente;
    }

    const hasErrors = Object.values(errors).some(Boolean);
    setFieldErrors(errors);
    if (hasErrors) return;

    onSubmit({
      cantidad: cantidadNumero,
      motivo: values.motivo || null,
    });
  };

  return (
    <DrawPanel
      isOpen={open}
      onClose={onCancel}
      title={item ? textos.salidaTitle(item.nombre) : ''}
      showActions
      formId="stock-movimiento-form"
      confirmText={textos.submitSalida}
      cancelText={textos.cancel}
      loading={isSubmitting}
      formData={values}
    >
      <form id="stock-movimiento-form" className={styles.form} onSubmit={handleSubmit}>
        <Input
          label={textos.cantidadLabel}
          type="number"
          value={values.cantidad}
          onChange={(event) => setField('cantidad')(event.target.value)}
          error={fieldErrors.cantidad}
          helperText={!fieldErrors.cantidad ? textos.cantidadSalidaHelper : undefined}
          required
        />

        <Input
          label={textos.motivoLabel}
          placeholder={textos.motivoPlaceholder}
          value={values.motivo}
          onChange={(event) => setField('motivo')(event.target.value)}
        />

        {item && !fieldErrors.cantidad && (
          <p className={styles.resultado}>{textos.stockResultante(stockResultante)}</p>
        )}

        {submitError && <p className={styles.error}>{submitError}</p>}
      </form>
    </DrawPanel>
  );
};

export default StockMovimientoModal;
