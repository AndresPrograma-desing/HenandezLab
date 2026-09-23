import { Plus } from 'lucide-react';
import { TEXTS } from '../../../../constants/texts';
import Badge from 'anteriority-ui/screens/components/Badge/index';
import Button from 'anteriority-ui/screens/components/Button/index';
import Input from 'anteriority-ui/screens/components/Input/index';
import styles from './index.module.css';

const ESTADO_OPTIONS = [
  { value: 'todas', label: TEXTS.solicitudes.busqueda.filtroEstadoTodas },
  { value: 'pendiente', label: TEXTS.solicitudes.estados.pendiente },
  { value: 'en_proceso', label: TEXTS.solicitudes.estados.en_proceso },
  { value: 'entregado', label: TEXTS.solicitudes.estados.entregado },
];

export const SolicitudesHeader = ({ total, onCreate, search, onSearchChange, estadoFiltro, onEstadoFiltroChange }) => (
  <div>
    <div className={styles.header}>
      <div className={styles.titleRow}>
        <h2>{TEXTS.solicitudes.title}</h2>
        <Badge label={TEXTS.comun.total} value={total} />
      </div>
      <Button variant={Button.VARIANTS.PRIMARY} onClick={onCreate} icon={Plus}>
        {TEXTS.solicitudes.createButton}
      </Button>
    </div>

    <div className={styles.filtros}>
      <div className={styles.busqueda}>
        <Input
          placeholder={TEXTS.solicitudes.busqueda.placeholder}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <div className={styles.estadoTabs}>
        {ESTADO_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={estadoFiltro === option.value ? Button.VARIANTS.PRIMARY : Button.VARIANTS.OUTLINE}
            size={Button.SIZES.SMALL}
            onClick={() => onEstadoFiltroChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  </div>
);

export default SolicitudesHeader;
