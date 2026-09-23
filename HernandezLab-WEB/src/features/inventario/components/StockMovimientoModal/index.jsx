import { useEffect, useState } from 'react';
import { TEXTS } from '../../../../constants/texts';
import { validateNumero } from '../../../../utils/validators';
import DrawPanel from 'anteriority-ui/screens/components/DrawPanel/index';
import Input from 'anteriority-ui/screens/components/Input/index';
import styles from './index.module.css';

const emptyValues = {
  cantidad: '',
  motivo: '',
  lote: '',
  fecha_vencimiento: '',
};

/**
 * Modal compartido para registrar entradas (compra) y salidas de stock de
 * un ítem de inventario. La sección se diferencia por color/copy según
 * `tipo` ('compra' | 'salida'), pero comparte el mismo formulario base.
 */
export const StockMovimientoModal = ({ open, item, tipo, onSubmit, onCancel, isSubmitting = false, submitError = null }) => {
  const [values, setValues] = useState(emptyValues);
  const [fieldErrors, setFieldErrors] = useState({});

  const esCompra = tipo === 'compra';
  const textos = TEXTS.inventario.movimientos;

  useEffect(() => {
    if (!open) return;
    setValues(emptyValues);
    setFieldErrors({});
  }, [open, item, tipo]);

  const setField = (field) => (value) => setValues((prev) => ({ ...prev, [field]: value }));

  const cantidadNumero = Number(values.cantidad) || 0;
  const stockResultante = item
    ? esCompra
      ? Number(item.stock_actual) + cantidadNumero
      : Number(item.stock_actual) - cantidadNumero
    : null;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!item) return;

    const errors = {
      cantidad: validateNumero(values.cantidad, textos.cantidadLabel, { min: 0.0001 }),
    };

    if (!errors.cantidad && !esCompra && cantidadNumero > Number(item.stock_actual)) {
      errors.cantidad = TEXTS.inventario.errors.stockInsuficiente;
    }

    const hasErrors = Object.values(errors).some(Boolean);
    setFieldErrors(errors);
    if (hasErrors) return;

    onSubmit({
      tipo,
      cantidad: cantidadNumero,
      motivo: values.motivo || null,
      lote: values.lote || null,
      fecha_vencimiento: values.fecha_vencimiento || null,
    });
  };

  return (
    <DrawPanel
      isOpen={open}
      onClose={onCancel}
      title={item ? (esCompra ? textos.compraTitle(item.nombre) : textos.salidaTitle(item.nombre)) : ''}
      showActions
      formId="stock-movimiento-form"
      confirmText={esCompra ? textos.submitCompra : textos.submitSalida}
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
          helperText={!fieldErrors.cantidad ? (esCompra ? textos.cantidadCompraHelper : textos.cantidadSalidaHelper) : undefined}
          required
        />

        {esCompra ? (
          <>
            <Input
              label={textos.loteLabel}
              value={values.lote}
              onChange={(event) => setField('lote')(event.target.value)}
            />
            <Input
              label={textos.fechaVencimientoLabel}
              type="date"
              value={values.fecha_vencimiento}
              onChange={(event) => setField('fecha_vencimiento')(event.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </>
        ) : (
          <Input
            label={textos.motivoLabel}
            placeholder={textos.motivoPlaceholder}
            value={values.motivo}
            onChange={(event) => setField('motivo')(event.target.value)}
          />
        )}

        {item && !fieldErrors.cantidad && (
          <p className={styles.resultado}>{textos.stockResultante(stockResultante)}</p>
        )}

        {submitError && <p className={styles.error}>{submitError}</p>}
      </form>
    </DrawPanel>
  );
};

export default StockMovimientoModal;
