import { useEffect, useState } from 'react';
import { TEXTS } from '../../../../constants/texts';
import { validateRequerido, validateNumero, validateFecha } from '../../../../utils/validators';
import { ItemsCompraList } from '../ItemsCompraList';
import DrawPanel from 'anteriority-ui/screens/components/DrawPanel/index';
import Input from 'anteriority-ui/screens/components/Input/index';
import Selector from 'anteriority-ui/screens/components/Material-UI/Components/Selector/index';
import styles from './index.module.css';

const todayIso = () => new Date().toISOString().slice(0, 10);

const emptyItem = () => ({
  id_item: '',
  cantidad_comprada: '',
  costo_unitario: '',
  numero_lote: '',
  fecha_vencimiento: '',
});

const emptyValues = () => ({
  id_proveedor: '',
  numero_factura: '',
  fecha_compra: todayIso(),
});

export const CompraFormModal = ({
  open,
  proveedores,
  inventarioItems,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitError = null,
}) => {
  const [values, setValues] = useState(emptyValues());
  const [items, setItems] = useState([emptyItem()]);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setValues(emptyValues());
    setItems([emptyItem()]);
    setFieldErrors({});
  }, [open]);

  const proveedorOptions = proveedores.map((p) => ({ value: p.id_proveedor, label: p.razon_social }));
  const inventarioOptions = inventarioItems.map((item) => ({ value: item.id_item, label: `${item.codigo} — ${item.nombre}` }));

  const setField = (field) => (value) => setValues((prev) => ({ ...prev, [field]: value }));

  const handleItemChange = (index, field, value) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleAddItem = () => setItems((prev) => [...prev, emptyItem()]);

  const handleRemoveItem = (index) => setItems((prev) => prev.filter((_, i) => i !== index));

  const validateItem = (item, index, allItems) => {
    const n = index + 1;
    const rowErrors = {};

    if (!item.id_item) {
      rowErrors.id_item = TEXTS.compras.errors.itemRequerido(n);
    } else if (allItems.some((other, i) => i !== index && other.id_item === item.id_item)) {
      rowErrors.id_item = TEXTS.compras.errors.itemDuplicado(n);
    }

    if (!item.cantidad_comprada || String(item.cantidad_comprada).trim() === '') {
      rowErrors.cantidad_comprada = TEXTS.compras.errors.cantidadRequerida(n);
    } else if (validateNumero(item.cantidad_comprada, 'Cantidad', { exclusiveMin: 0 })) {
      rowErrors.cantidad_comprada = TEXTS.compras.errors.cantidadInvalida(n);
    }

    if (!item.costo_unitario || String(item.costo_unitario).trim() === '') {
      rowErrors.costo_unitario = TEXTS.compras.errors.costoRequerido(n);
    } else if (validateNumero(item.costo_unitario, 'Costo', { exclusiveMin: 0 })) {
      rowErrors.costo_unitario = TEXTS.compras.errors.costoInvalido(n);
    }

    if (item.fecha_vencimiento) {
      if (validateFecha(item.fecha_vencimiento, { noPast: true })) {
        rowErrors.fecha_vencimiento = TEXTS.compras.errors.fechaVencimientoPasada(n);
      } else if (values.fecha_compra && item.fecha_vencimiento < values.fecha_compra) {
        rowErrors.fecha_vencimiento = TEXTS.compras.errors.fechaVencimientoAnteriorCompra(n);
      }
    }

    return rowErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const errors = {
      id_proveedor: validateRequerido(values.id_proveedor, TEXTS.compras.form.proveedorLabel),
      fecha_compra: validateFecha(values.fecha_compra, { noFuture: true })
        ? TEXTS.compras.errors.fechaCompraFutura
        : null,
    };

    const itemsErrors = items.map((item, index) => validateItem(item, index, items));
    const hasItemErrors = itemsErrors.some((rowErrors) => Object.keys(rowErrors).length > 0);

    if (hasItemErrors) {
      errors.items = itemsErrors;
    } else if (items.length === 0) {
      errors.generalItems = TEXTS.compras.errors.agregaItem;
    }

    const hasErrors = Boolean(errors.id_proveedor) || Boolean(errors.fecha_compra) || hasItemErrors || Boolean(errors.generalItems);
    setFieldErrors(errors);
    if (hasErrors) return;

    onSubmit({
      id_proveedor: values.id_proveedor,
      numero_factura: values.numero_factura || null,
      fecha_compra: values.fecha_compra,
      items: items.map((item) => ({
        id_item: item.id_item,
        cantidad_comprada: Number(item.cantidad_comprada),
        costo_unitario: Number(item.costo_unitario),
        numero_lote: item.numero_lote || null,
        fecha_vencimiento: item.fecha_vencimiento || null,
      })),
    });
  };

  return (
    <DrawPanel
      isOpen={open}
      onClose={onCancel}
      title={TEXTS.compras.form.createTitle}
      showActions
      formId="compra-form"
      confirmText={TEXTS.compras.form.submitCreate}
      cancelText={TEXTS.compras.form.cancel}
      loading={isSubmitting}
      formData={values}
      width="640px"
    >
      <form id="compra-form" className={styles.form} onSubmit={handleSubmit}>
        <Selector
          id="compra-proveedor"
          label={TEXTS.compras.form.proveedorLabel}
          options={proveedorOptions}
          value={values.id_proveedor}
          onChange={(event) => setField('id_proveedor')(event.target.value)}
          required
        />
        {fieldErrors.id_proveedor && <p className={styles.error}>{fieldErrors.id_proveedor}</p>}

        <Input
          label={TEXTS.compras.form.numeroFacturaLabel}
          value={values.numero_factura}
          onChange={(event) => setField('numero_factura')(event.target.value)}
        />
        <Input
          label={TEXTS.compras.form.fechaCompraLabel}
          type="date"
          value={values.fecha_compra}
          onChange={(event) => setField('fecha_compra')(event.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: todayIso() }}
          error={fieldErrors.fecha_compra}
        />

        <ItemsCompraList
          items={items}
          inventarioOptions={inventarioOptions}
          onAdd={handleAddItem}
          onRemove={handleRemoveItem}
          onChange={handleItemChange}
          itemErrors={fieldErrors.items}
          generalError={fieldErrors.generalItems}
          minFechaVencimiento={values.fecha_compra}
        />

        {submitError && <p className={styles.error}>{submitError}</p>}
      </form>
    </DrawPanel>
  );
};

export default CompraFormModal;
