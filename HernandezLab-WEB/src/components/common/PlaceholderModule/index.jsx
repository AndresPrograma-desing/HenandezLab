import { TEXTS } from '../../../constants/texts';
import styles from './index.module.css';

export const PlaceholderModule = ({ title }) => (
  <div className={styles.wrapper}>
    <h2>{title}</h2>
    <p>{TEXTS.comun.proximamente}</p>
  </div>
);

export default PlaceholderModule;
