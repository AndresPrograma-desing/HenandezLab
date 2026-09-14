import { useMemo } from 'react';
import { TEXTS } from '../../../constants/texts';
import { useSucursalActiva } from '../../../hooks/useSucursalActiva';
import { useSucursales } from '../../../features/sucursales/hooks/useSucursales';
import Selector from 'anteriority-ui/screens/components/Material-UI/Components/Selector/index';
import styles from './index.module.css';

export const SucursalSelector = () => {
  const { idSucursalActiva, cambiarSucursal, puedeCambiarSucursal } = useSucursalActiva();
  const { sucursales } = useSucursales();

  const options = useMemo(
    () => sucursales.map((sucursal) => ({ value: sucursal.id_sucursal, label: sucursal.nombre })),
    [sucursales]
  );

  if (!puedeCambiarSucursal) return null;

  return (
    <div className={styles.wrapper}>
      <Selector
        id="sucursal-activa-selector"
        label={TEXTS.sucursalSelector.label}
        placeholder={TEXTS.sucursalSelector.placeholder}
        options={options}
        value={idSucursalActiva ?? ''}
        onChange={(event) => cambiarSucursal(event.target.value)}
        disableClearable
      />
    </div>
  );
};

export default SucursalSelector;
