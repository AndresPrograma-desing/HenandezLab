import { useState } from 'react';
import { FileText } from 'lucide-react';
import { TEXTS } from '../../../constants/texts';
import Button from 'anteriority-ui/screens/components/Button/index';

export const ExportPdfButton = ({ onExport, disabled = false }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleClick = async () => {
    setIsExporting(true);
    try {
      await onExport();
    } catch (err) {
      console.error('Error al exportar a PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant={Button.VARIANTS.OUTLINE}
      onClick={handleClick}
      disabled={disabled || isExporting}
      icon={FileText}
    >
      {TEXTS.comun.exportarPdf}
    </Button>
  );
};

export default ExportPdfButton;
