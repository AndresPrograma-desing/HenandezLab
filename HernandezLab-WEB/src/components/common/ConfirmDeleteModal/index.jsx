import Frame from 'anteriority-ui/screens/components/Frame/index';
import Button from 'anteriority-ui/screens/components/Button/index';
import styles from './index.module.css';

export const ConfirmDeleteModal = ({
  open,
  title,
  message,
  confirmText,
  cancelText,
  isDeleting = false,
  error = null,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <Frame title={title} isModal onClose={onCancel}>
      <p className={styles.message}>{message}</p>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.actions}>
        <Button variant={Button.VARIANTS.OUTLINE} onClick={onCancel} disabled={isDeleting}>
          {cancelText}
        </Button>
        <Button variant={Button.VARIANTS.DANGER} onClick={onConfirm} loading={isDeleting}>
          {confirmText}
        </Button>
      </div>
    </Frame>
  );
};

export default ConfirmDeleteModal;
