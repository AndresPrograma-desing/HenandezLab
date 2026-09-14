import { Plus } from 'lucide-react';
import { TEXTS } from '../../../../constants/texts';
import Badge from 'anteriority-ui/screens/components/Badge/index';
import Button from 'anteriority-ui/screens/components/Button/index';
import styles from './index.module.css';

export const SucursalesHeader = ({ total, onCreate }) => (
  <div className={styles.header}>
    <div className={styles.titleRow}>
      <h2>{TEXTS.sucursales.title}</h2>
      <Badge label={TEXTS.comun.total} value={total} />
    </div>
    <Button variant={Button.VARIANTS.PRIMARY} onClick={onCreate} icon={Plus}>
      {TEXTS.sucursales.createButton}
    </Button>
  </div>
);

export default SucursalesHeader;
