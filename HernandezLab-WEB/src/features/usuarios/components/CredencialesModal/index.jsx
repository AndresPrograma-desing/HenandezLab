import { TEXTS } from '../../../../constants/texts';
import Frame from 'anteriority-ui/screens/components/Frame/index';
import Button from 'anteriority-ui/screens/components/Button/index';
import styles from './index.module.css';

export const CredencialesModal = ({ info, onClose }) => {
  if (!info) return null;

  return (
    <Frame title={info.title} isModal onClose={onClose}>
      <p className={styles.message}>{info.message}</p>
      <div className={styles.actions}>
        <Button variant={Button.VARIANTS.PRIMARY} onClick={onClose}>
          {TEXTS.usuarios.form.cerrar}
        </Button>
      </div>
    </Frame>
  );
};

export default CredencialesModal;
