import { TEXTS } from '../../../../../../constants/texts';
import Checks from 'anteriority-ui/screens/components/Checks/index';
import styles from './index.module.css';

export const ExamenesChecklist = ({ examenes, selectedIds, onToggle, consumoPreview, total }) => (
  <div className={styles.section}>
    <h4>{TEXTS.solicitudes.form.examenesSectionTitle}</h4>
    <p className={styles.label}>{TEXTS.solicitudes.form.examenesLabel}</p>

    <div className={styles.list}>
      {examenes.map((examen) => (
        <Checks
          key={examen.id_examen}
          label={`${examen.nombre_examen} — $${Number(examen.precio).toFixed(2)}`}
          checked={selectedIds.includes(examen.id_examen)}
          onChange={() => onToggle(examen.id_examen)}
        />
      ))}
    </div>

    {selectedIds.length > 0 && (
      <div className={styles.preview}>
        <h5>{TEXTS.solicitudes.form.consumoTitle}</h5>
        {consumoPreview.length === 0 ? (
          <p className={styles.emptyPreview}>{TEXTS.solicitudes.form.consumoVacio}</p>
        ) : (
          <ul>
            {consumoPreview.map((item, idx) => (
              <li key={idx}>
                {item.nombre} × {item.cantidad}
              </li>
            ))}
          </ul>
        )}
      </div>
    )}

    <div className={styles.total}>
      <span>{TEXTS.solicitudes.form.totalLabel}</span>
      <strong>${total.toFixed(2)}</strong>
    </div>
  </div>
);

export default ExamenesChecklist;
