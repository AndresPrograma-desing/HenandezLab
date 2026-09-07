import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, ChevronUp } from 'lucide-react'; // <-- Cambiado de X a ChevronRight y ChevronUp
import styles from './index.module.css';

import Button from '../Button/index';
import CountdownBar from '../CountdownBar/index';

const DrawPanel = ({ 
  isOpen, 
  onClose, 
  title, 
  description,
  descriptionPosition = 'top',
  children,
  width = '400px',
  showActions = false,
  onConfirm,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  formId,
  loading = false,
  success = undefined,
  className = '',
  showCountdown = false,
  countdownActive = true,
  countdownDuration,
  countdownOnComplete,
  countdownExpiresAt,
  countdownTotalDuration,
  countdownValue,
  countdownHeight,
  countdownColors,
  countdownIncrement = true,
  progressMode = 'count',
  totalFields = 0,
  filledFields = 0,
  totalItems = [],
  selectedItems = [],
  formData,
  requiredFields = [],
  panelColor = '#ffffff',
  textColor = '#0f172a',
  mutedTextColor = '#64748b',
  borderColor = '#e2e8f0',
  hasUnsavedChanges,
  closeConfirmMessage = 'Vuelve a hacer clic fuera para cerrar sin guardar',
  anchor = 'right'
}) => {
  const [render, setRender] = useState(isOpen);
  const [pendingClose, setPendingClose] = useState(false);
  const pendingCloseTimeoutRef = useRef(null);

  useEffect(() => {
    if (isOpen) setRender(true);
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (pendingCloseTimeoutRef.current) clearTimeout(pendingCloseTimeoutRef.current);
    };
  }, []);

  const onAnimationEnd = () => {
    if (!isOpen) {
      setRender(false);
      setPendingClose(false);
      if (pendingCloseTimeoutRef.current) {
        clearTimeout(pendingCloseTimeoutRef.current);
        pendingCloseTimeoutRef.current = null;
      }
    }
  };

  if (!render) return null;

  // Contenido "sucio": si hay datos cargados en el formulario, un solo clic (fuera
  // o en el botón de cerrar) no cierra el panel, para no perder lo que el usuario
  // escribió; requiere un segundo clic. Sin datos, el panel se cierra normalmente.
  const formHasValues = formData
    ? Object.values(formData).some((val) => val !== undefined && val !== null && String(val).trim() !== '')
    : false;
  const isDirty = hasUnsavedChanges ?? formHasValues;

  const handleCloseClick = () => {
    if (!isDirty) {
      onClose();
      return;
    }
    if (pendingClose) {
      if (pendingCloseTimeoutRef.current) clearTimeout(pendingCloseTimeoutRef.current);
      setPendingClose(false);
      onClose();
      return;
    }
    setPendingClose(true);
    pendingCloseTimeoutRef.current = setTimeout(() => setPendingClose(false), 2500);
  };

  // Lógica Genérica de Cálculo de Progreso
  let calculatedProgress = countdownValue ?? 0;

  if (progressMode === 'selection') {
    const total = Array.isArray(totalItems) ? totalItems.length : Number(totalItems) || 0;
    const selected = Array.isArray(selectedItems) ? selectedItems.length : Number(selectedItems) || 0;
    calculatedProgress = total > 0 ? (selected / total) * 100 : 0;
  } else if (progressMode === 'form' && formData && Array.isArray(requiredFields) && requiredFields.length > 0) {
    const filledCount = requiredFields.filter(field => {
      const val = formData[field];
      return val !== undefined && val !== null && String(val).trim() !== '';
    }).length;
    calculatedProgress = (filledCount / requiredFields.length) * 100;
  } else if (progressMode === 'count' && totalFields > 0) {
    calculatedProgress = Math.min(100, Math.max(0, (filledFields / totalFields) * 100));
  }

  const overlayClass = anchor === 'top' ? styles.overlayTop : styles.overlay;
  const panelClass = anchor === 'top' ? styles.panelTop : styles.panel;
  const animClass = isOpen
    ? (anchor === 'top' ? styles.slideInTop : styles.slideIn)
    : (anchor === 'top' ? styles.slideOutTop : styles.slideOut);
  const CloseIcon = anchor === 'top' ? ChevronUp : ChevronRight;

  return createPortal(
    <div
      className={`${overlayClass} ${isOpen ? styles.fadeIn : styles.fadeOut}`}
      onClick={handleCloseClick}
      onAnimationEnd={onAnimationEnd}
    >
      <div
        className={`${panelClass} ${animClass} ${className}`}
        style={{ maxWidth: width, backgroundColor: panelColor }}
        onClick={(e) => e.stopPropagation()}
      >
        {pendingClose && (
          <div className={styles.closeHint}>{closeConfirmMessage}</div>
        )}

        <div className={styles.header} style={{ backgroundColor: panelColor, borderBottomColor: borderColor }}>
          <div className={styles.headerTitleContainer}>
            <h3 className={styles.title} style={{ color: textColor }}>{title}</h3>
            {description && descriptionPosition === 'top' && (
              <p className={styles.description} style={{ color: mutedTextColor }}>{description}</p>
            )}
          </div>
          <div className={styles.closeButtonWrapper}>
            <Button
              variant={Button.VARIANTS.DANGER}
              color={Button.COLORS.TRANSPARENT}
              onClick={handleCloseClick}
              circle
              aria-label="Cerrar panel"
            >
              <CloseIcon size={24} color={mutedTextColor} />
            </Button>
          </div>
        </div>

        {showCountdown && (
          <div style={{ padding: '0 1.5rem', width: '100%', boxSizing: 'border-box' }}>
            <CountdownBar
              active={countdownActive}
              duration={countdownDuration}
              onComplete={countdownOnComplete}
              expiresAt={countdownExpiresAt}
              totalDuration={countdownTotalDuration}
              value={calculatedProgress}
              height={countdownHeight}
              colors={countdownColors}
              width="100%"
              increment={countdownIncrement}
            />
          </div>
        )}

        <div className={styles.content}>
          {children}
          {description && descriptionPosition === 'bottom' && (
            <div className={styles.descriptionBottom} style={{ borderTopColor: borderColor }}>
              <h4 className={styles.descriptionBottomTitle} style={{ color: textColor }}>Descripción de Tarea</h4>
              <p className={styles.descriptionBottomText} style={{ color: mutedTextColor }}>{description}</p>
            </div>
          )}
        </div>

        {showActions && (
          <div className={styles.footer} style={{ backgroundColor: panelColor, borderTopColor: borderColor }}>
            <Button 
              variant="" 
              onClick={onClose} 
              border={Button.COLORS.RED}
              disabled={loading} 
              fullWidth
            >
              {cancelText}
            </Button>
            <Button 
              type={formId ? 'submit' : 'button'} 
              form={formId} 
              variant="primary" 
              color={Button.COLORS.PRIMARY} 
              onClick={onConfirm} 
              loading={loading}
              success={success}
              fullWidth
            >
              {confirmText}
            </Button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default DrawPanel;
