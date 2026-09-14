import { TEXTS } from '../../../../constants/texts';
import Button from 'anteriority-ui/screens/components/Button/index';
import styles from './index.module.css';

const CATEGORIAS = ['insumos', 'reactivos', 'mobiliario', 'maquinaria'];

export const CategoriaTabs = ({ value, onChange }) => (
  <div className={styles.tabs}>
    {CATEGORIAS.map((categoria) => (
      <Button
        key={categoria}
        variant={value === categoria ? Button.VARIANTS.PRIMARY : Button.VARIANTS.OUTLINE}
        size={Button.SIZES.SMALL}
        onClick={() => onChange(categoria)}
      >
        {TEXTS.inventario.categorias[categoria]}
      </Button>
    ))}
  </div>
);

export default CategoriaTabs;
