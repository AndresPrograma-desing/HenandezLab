import { Trash2 } from 'lucide-react';
import { TEXTS } from '../../../../constants/texts';
import Input from 'anteriority-ui/screens/components/Input/index';
import Selector from 'anteriority-ui/screens/components/Material-UI/Components/Selector/index';
import Button from 'anteriority-ui/screens/components/Button/index';
import styles from './index.module.css';

export const ItemsCompraList = ({
  items,
  inventarioOptions,
  onAdd,
  onRemove,
  onChange,
  itemErrors = [],
  generalError,
  minFechaVencimiento,
}) => {
  const total = items.reduce((sum, item) => sum + Number(item.cantidad_comprada || 0) * Number(item.costo_unitario || 0), 0);

  return (
    <div className={styles.section}>
      <h4>{TEXTS.compras.form.itemsSectionTitle}</h4>

      {items.map((item, index) => {
        const rowErrors = itemErrors[index] ?? {};
        return (
          <div key={index} className={styles.rowGroup}>
            <div className={styles.row}>
              <div className={styles.field}>
                <Selector
                  id={`compra-item-${index}`}
                  label={TEXTS.compras.form.itemLabel}
                  options={inventarioOptions}
                  value={item.id_item}
                  onChange={(event) => onChange(index, 'id_item', event.target.value)}
                />
                {rowErrors.id_item && <p className={styles.fieldError}>{rowErrors.id_item}</p>}
              </div>
              <div className={styles.field}>
                <Input
                  label={TEXTS.compras.form.cantidadLabel}
                  type="number"
                  value={item.cantidad_comprada}
                  onChange={(event) => onChange(index, 'cantidad_comprada', event.target.value)}
                  inputProps={{ min: 0.01, step: 'any' }}
                  error={rowErrors.cantidad_comprada}
                />
              </div>
              <div className={styles.field}>
                <Input
                  label={TEXTS.compras.form.costoUnitarioLabel}
                  type="number"
                  value={item.costo_unitario}
                  onChange={(event) => onChange(index, 'costo_unitario', event.target.value)}
                  inputProps={{ min: 0.01, step: 'any' }}
                  error={rowErrors.costo_unitario}
                />
              </div>
              <div className={styles.field}>
                <Input
                  label={TEXTS.compras.form.loteLabel}
                  value={item.numero_lote}
                  onChange={(event) => onChange(index, 'numero_lote', event.target.value)}
                />
              </div>
              <div className={styles.field}>
                <Input
                  label={TEXTS.compras.form.fechaVencimientoLabel}
                  type="date"
                  value={item.fecha_vencimiento}
                  onChange={(event) => onChange(index, 'fecha_vencimiento', event.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: minFechaVencimiento || undefined }}
                  error={rowErrors.fecha_vencimiento}
                />
              </div>
              <Button
                variant={Button.VARIANTS.GHOST}
                size={Button.SIZES.SMALL}
                circle
                onClick={() => onRemove(index)}
                ToolTip={TEXTS.compras.form.removeItemButton}
              >
                <Trash2 size={16} color="#dc2626" />
              </Button>
            </div>
          </div>
        );
      })}

      {generalError && <p className={styles.error}>{generalError}</p>}

      <Button variant={Button.VARIANTS.OUTLINE} onClick={onAdd} type="button">
        {TEXTS.compras.form.addItemButton}
      </Button>

      <div className={styles.total}>
        <span>{TEXTS.compras.form.totalLabel}</span>
        <strong>${total.toFixed(2)}</strong>
      </div>
    </div>
  );
};

export default ItemsCompraList;
