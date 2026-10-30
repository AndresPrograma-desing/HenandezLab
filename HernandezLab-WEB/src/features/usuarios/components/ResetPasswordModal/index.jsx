import { useEffect, useState } from 'react';
import { TEXTS } from '../../../../constants/texts';
import { validatePassword } from '../../../../utils/validators';
import Frame from 'anteriority-ui/screens/components/Frame/index';
import Input from 'anteriority-ui/screens/components/Input/index';
import Button from 'anteriority-ui/screens/components/Button/index';
import styles from './index.module.css';

const generarPasswordAleatoria = () => Math.random().toString(36).slice(-10) + 'A1';

export const ResetPasswordModal = ({ usuario, onSubmit, onCancel, isSubmitting = false, submitError = null }) => {
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState(null);

  useEffect(() => {
    if (!usuario) return;
    setPassword('');
    setFieldError(null);
  }, [usuario]);

  if (!usuario) return null;

  const handleSubmit = (event) => {
    event.preventDefault();

    const error = validatePassword(password);
    setFieldError(error);
    if (error) return;

    onSubmit(password);
  };

  return (
    <Frame title={TEXTS.usuarios.resetPassword.title(`${usuario.nombre} ${usuario.apellido}`)} isModal onClose={onCancel}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.passwordRow}>
          <Input
            label={TEXTS.usuarios.form.passwordLabel}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={fieldError}
            required
          />
          <Button type="button" variant={Button.VARIANTS.OUTLINE} onClick={() => setPassword(generarPasswordAleatoria())}>
            {TEXTS.usuarios.form.generarPassword}
          </Button>
        </div>

        {submitError && <p className={styles.error}>{submitError}</p>}

        <div className={styles.actions}>
          <Button type="button" variant={Button.VARIANTS.OUTLINE} onClick={onCancel} disabled={isSubmitting}>
            {TEXTS.usuarios.form.cancel}
          </Button>
          <Button type="submit" variant={Button.VARIANTS.PRIMARY} loading={isSubmitting}>
            {TEXTS.usuarios.resetPassword.submit}
          </Button>
        </div>
      </form>
    </Frame>
  );
};

export default ResetPasswordModal;
