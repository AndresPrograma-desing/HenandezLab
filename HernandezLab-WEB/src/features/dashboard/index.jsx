import { useNavigate } from 'react-router-dom';
import { ClipboardList, Boxes } from 'lucide-react';
import { TEXTS } from '../../constants/texts';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { useSucursalActiva } from '../../hooks/useSucursalActiva';
import { useDashboardResumen } from './hooks/useDashboardResumen';
import { ResumenGrid } from './components/ResumenGrid';
import Button from 'anteriority-ui/screens/components/Button/index';
import styles from './index.module.css';

export const DashboardPage = () => {
  const { empleado } = useAuth();
  const { idSucursalActiva } = useSucursalActiva();
  const navigate = useNavigate();

  const esAdministrativo = empleado?.rol === 'administrativo';
  const { resumen, isLoading, error, refetch } = useDashboardResumen(idSucursalActiva, { esAdministrativo });

  return (
    <div>
      <div className={styles.header}>
        <h2>{empleado ? TEXTS.dashboard.saludo(empleado.nombre) : TEXTS.dashboard.title}</h2>
        <p className={styles.subtitulo}>{TEXTS.dashboard.subtitulo}</p>
      </div>

      {!idSucursalActiva ? (
        <p>{TEXTS.dashboard.sinSucursal}</p>
      ) : isLoading ? (
        <p>{TEXTS.comun.cargando}</p>
      ) : error ? (
        <div>
          <p>{TEXTS.comun.errorCarga}</p>
          <Button variant={Button.VARIANTS.OUTLINE} size={Button.SIZES.SMALL} onClick={refetch}>
            {TEXTS.comun.reintentar}
          </Button>
        </div>
      ) : (
        <ResumenGrid resumen={resumen} />
      )}

      <h3>{TEXTS.dashboard.accesosRapidos}</h3>
      <div className={styles.accesos}>
        <Button variant={Button.VARIANTS.PRIMARY} icon={ClipboardList} onClick={() => navigate(ROUTES.SOLICITUDES)}>
          {TEXTS.layout.nav.solicitudes}
        </Button>
        <Button variant={Button.VARIANTS.OUTLINE} icon={Boxes} onClick={() => navigate(ROUTES.INVENTARIO)}>
          {TEXTS.layout.nav.inventario}
        </Button>
      </div>
    </div>
  );
};

export default DashboardPage;
