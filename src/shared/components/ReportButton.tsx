import React from 'react';
import { Button } from './Button';
import { FileText } from 'lucide-react';

interface ReportButtonProps {
  onClick: () => void;
  title?: string;
  variant?: 'primary' | 'outline';
}

export const ReportButton: React.FC<ReportButtonProps> = ({
  onClick,
  title = 'Generar Reporte',
  variant = 'primary'
}) => {
  return (
    <Button onClick={onClick} variant={variant}>
      <FileText size={16} className="mr-2" />
      {title}
    </Button>
  );
}; 