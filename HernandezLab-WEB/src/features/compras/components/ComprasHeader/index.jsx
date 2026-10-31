import { Plus } from 'lucide-react';
import { TEXTS } from '../../../../constants/texts';
import Badge from 'anteriority-ui/screens/components/Badge/index';
import Button from 'anteriority-ui/screens/components/Button/index';
import { ExportPdfButton } from '../../../../components/common/ExportPdfButton';
import styles from './index.module.css';

export const ComprasHeader = ({ total, onCreate, onExport }) => (
  <div className={styles.header}>
    <div className={styles.titleRow}>
      <h2>{TEXTS.compras.title}</h2>
      <Badge label={TEXTS.comun.total} value={total} />
    </div>
    <div className={styles.acciones}>
      <ExportPdfButton onExport={onExport} disabled={total === 0} />
      <Button variant={Button.VARIANTS.PRIMARY} onClick={onCreate} icon={Plus}>
        {TEXTS.compras.createButton}
      </Button>
    </div>
  </div>
);

export default ComprasHeader;
