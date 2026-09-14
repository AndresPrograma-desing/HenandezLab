import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { TEXTS } from '../../../constants/texts';
import { useAuth } from '../../../hooks/useAuth';
import Input from 'anteriority-ui/screens/components/Input/index';
import Button from 'anteriority-ui/screens/components/Button/index';
import styles from './index.module.css';

export const LoginPage = () => {
  const { isAuthenticated, isLoading, signIn, empleadoError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoading && isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(TEXTS.auth.errors.credenciales);
    }

    setIsSubmitting(false);
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>{TEXTS.auth.title}</h1>
        <p className={styles.subtitle}>{TEXTS.auth.subtitle}</p>

        <Input
          label={TEXTS.auth.emailLabel}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoFocus
        />
        <Input
          label={TEXTS.auth.passwordLabel}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {(error || empleadoError) && (
          <p className={styles.error}>{error || empleadoError}</p>
        )}

        <Button type="submit" fullWidth loading={isSubmitting} variant={Button.VARIANTS.PRIMARY}>
          {isSubmitting ? TEXTS.auth.submitting : TEXTS.auth.submit}
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
