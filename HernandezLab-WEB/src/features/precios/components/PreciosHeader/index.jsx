import { TEXTS } from '../../../../constants/texts';
import Badge from 'anteriority-ui/screens/components/Badge/index';
import { ExportPdfButton } from '../../../../components/common/ExportPdfButton';
import styles from './index.module.css';

export const PreciosHeader = ({ total, onExport }) => (
  <div className={styles.header}>
    <div className={styles.titleRow}>
      <h2>{TEXTS.precios.title}</h2>
      <Badge label={TEXTS.comun.total} value={total} />
    </div>
    <ExportPdfButton onExport={onExport} disabled={total === 0} />
  </div>
);

export default PreciosHeader;
