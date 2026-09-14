import { useEffect, useState } from 'react';
import { TEXTS } from '../../../../constants/texts';
import { validateRequerido, validateNumero } from '../../../../utils/validators';
import DrawPanel from 'anteriority-ui/screens/components/DrawPanel/index';
import Input from 'anteriority-ui/screens/components/Input/index';
import Selector from 'anteriority-ui/screens/components/Material-UI/Components/Selector/index';
import styles from './index.module.css';

const buildEmptyValues = (categoria) => ({
  categoria,
  codigo: '',
  nombre: '',
  stock_actual: '',
  stock_minimo: '',
  fecha_vencimiento: '',
  lote: '',
  id_proveedor: '',
});

const categoriaOptions = ['insumos', 'reactivos', 'mobiliario', 'maquinaria'].map((value) => ({
  value,
  label: TEXTS.inventario.categorias[value],
}));

export const InventarioFormModal = ({
  open,
  item,
  categoriaActiva,
  proveedores,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitError = null,
}) => {
  const isEdit = Boolean(item);
  const [values, setValues] = useState(buildEmptyValues(categoriaActiva));
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setFieldErrors({});
    setValues(
      item
        ? {
            categoria: item.categoria,
            codigo: item.codigo,
            nombre: item.nombre,
            stock_actual: String(item.stock_actual),
            stock_minimo: String(item.stock_minimo),
            fecha_vencimiento: item.fecha_vencimiento ?? '',
            lote: item.lote ?? '',
            id_proveedor: item.id_proveedor ?? '',
          }
        : buildEmptyValues(categoriaActiva)
    );
  }, [open, item, categoriaActiva]);

  const proveedorOptions = [
    { value: '', label: TEXTS.inventario.form.sinProveedorOption },
    ...proveedores.map((p) => ({ value: p.id_proveedor, label: p.razon_social })),
  ];

  const setField = (field) => (value) => setValues((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();

    const errors = {
      categoria: validateRequerido(values.categoria, TEXTS.inventario.form.categoriaLabel),
      codigo: validateRequerido(values.codigo, TEXTS.inventario.form.codigoLabel),
      nombre: validateRequerido(values.nombre, TEXTS.inventario.form.nombreLabel),
      stock_actual: validateNumero(values.stock_actual, TEXTS.inventario.form.stockActualLabel, { min: 0 }),
      stock_minimo: validateNumero(values.stock_minimo, TEXTS.inventario.form.stockMinimoLabel, { min: 0 }),
    };

    const hasErrors = Object.values(errors).some(Boolean);
    setFieldErrors(errors);
    if (hasErrors) return;

    onSubmit({
      categoria: values.categoria,
      codigo: values.codigo,
      nombre: values.nombre,
      stock_actual: Number(values.stock_actual),
      stock_minimo: Number(values.stock_minimo),
      fecha_vencimiento: values.fecha_vencimiento || null,
      lote: values.lote || null,
      id_proveedor: values.id_proveedor || null,
    });
  };

  return (
    <DrawPanel
      isOpen={open}
      onClose={onCancel}
      title={isEdit ? TEXTS.inventario.form.editTitle : TEXTS.inventario.form.createTitle}
      showActions
      formId="inventario-form"
      confirmText={isEdit ? TEXTS.inventario.form.submitEdit : TEXTS.inventario.form.submitCreate}
      cancelText={TEXTS.inventario.form.cancel}
      loading={isSubmitting}
      formData={values}
    >
      <form id="inventario-form" className={styles.form} onSubmit={handleSubmit}>
        <Selector
          id="inventario-categoria"
          label={TEXTS.inventario.form.categoriaLabel}
          options={categoriaOptions}
          value={values.categoria}
          onChange={(event) => setField('categoria')(event.target.value)}
          required
        />
        {fieldErrors.categoria && <p className={styles.selectError}>{fieldErrors.categoria}</p>}

        <Input
          label={TEXTS.inventario.form.codigoLabel}
          value={values.codigo}
          onChange={(event) => setField('codigo')(event.target.value)}
          error={fieldErrors.codigo}
          required
        />
        <Input
          label={TEXTS.inventario.form.nombreLabel}
          value={values.nombre}
          onChange={(event) => setField('nombre')(event.target.value)}
          error={fieldErrors.nombre}
          required
        />
        <Input
          label={TEXTS.inventario.form.stockActualLabel}
          type="number"
          value={values.stock_actual}
          onChange={(event) => setField('stock_actual')(event.target.value)}
          error={fieldErrors.stock_actual}
          required
        />
        <Input
          label={TEXTS.inventario.form.stockMinimoLabel}
          type="number"
          value={values.stock_minimo}
          onChange={(event) => setField('stock_minimo')(event.target.value)}
          error={fieldErrors.stock_minimo}
          required
        />
        <Input
          label={TEXTS.inventario.form.fechaVencimientoLabel}
          type="date"
          value={values.fecha_vencimiento}
          onChange={(event) => setField('fecha_vencimiento')(event.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Input
          label={TEXTS.inventario.form.loteLabel}
          value={values.lote}
          onChange={(event) => setField('lote')(event.target.value)}
        />
        <Selector
          id="inventario-proveedor"
          label={TEXTS.inventario.form.proveedorLabel}
          options={proveedorOptions}
          value={values.id_proveedor}
          onChange={(event) => setField('id_proveedor')(event.target.value)}
        />

        {submitError && <p className={styles.error}>{submitError}</p>}
      </form>
    </DrawPanel>
  );
};

export default InventarioFormModal;
