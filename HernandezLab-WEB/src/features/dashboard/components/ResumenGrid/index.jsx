import { ClipboardList, PackageX, CalendarClock, Boxes, Users, Building2 } from 'lucide-react';
import { TEXTS } from '../../../../constants/texts';
import styles from './index.module.css';

const StatCard = ({ icon: Icon, label, value, alerta }) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <span className={`${styles.iconWrap} ${alerta ? styles.alerta : ''}`}>
        <Icon size={18} />
      </span>
      <span className={styles.cardLabel}>{label}</span>
    </div>
    <span className={styles.cardValue}>{value}</span>
  </div>
);

export const ResumenGrid = ({ resumen }) => (
  <div className={styles.grid}>
    <StatCard
      icon={ClipboardList}
      label={TEXTS.dashboard.tarjetas.solicitudesPendientes}
      value={resumen.solicitudesPendientes}
      alerta={resumen.solicitudesPendientes > 0}
    />
    <StatCard icon={Boxes} label={TEXTS.dashboard.tarjetas.totalInventario} value={resumen.totalInventario} />
    <StatCard
      icon={PackageX}
      label={TEXTS.dashboard.tarjetas.stockBajo}
      value={resumen.stockBajo}
      alerta={resumen.stockBajo > 0}
    />
    <StatCard
      icon={CalendarClock}
      label={TEXTS.dashboard.tarjetas.porVencer}
      value={resumen.porVencer}
      alerta={resumen.porVencer > 0}
    />
    {resumen.usuariosActivos !== null && (
      <StatCard icon={Users} label={TEXTS.dashboard.tarjetas.usuariosActivos} value={resumen.usuariosActivos} />
    )}
    {resumen.sucursalesActivas !== null && (
      <StatCard icon={Building2} label={TEXTS.dashboard.tarjetas.sucursalesActivas} value={resumen.sucursalesActivas} />
    )}
  </div>
);

export default ResumenGrid;
