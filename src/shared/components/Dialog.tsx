import React, { useEffect, forwardRef, useRef, ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Handle Escape key to close dialog
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [open, onOpenChange]);

  // Handle click outside to close dialog
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === dialogRef.current) {
      onOpenChange(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={handleOverlayClick}
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  );
};

interface DialogContentProps {
  className?: string;
  children: ReactNode;
}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className = '', children }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-secondary-50 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto ${className}`}
        role="document"
      >
        {children}
      </div>
    );
  }
);
DialogContent.displayName = 'DialogContent';

interface DialogHeaderProps {
  className?: string;
  children: ReactNode;
}

export const DialogHeader = ({ className = '', children }: DialogHeaderProps) => {
  return (
    <div className={`px-6 pt-6 pb-4 border-b border-secondary-200 ${className}`}>
      {children}
    </div>
  );
};

interface DialogTitleProps {
  className?: string;
  children: ReactNode;
}

export const DialogTitle = ({ className = '', children }: DialogTitleProps) => {
  return (
    <h2 className={`text-xl font-bold text-secondary-900 ${className}`} id="dialog-title">
      {children}
    </h2>
  );
};

interface DialogFooterProps {
  className?: string;
  children: ReactNode;
}

export const DialogFooter = ({ className = '', children }: DialogFooterProps) => {
  return (
    <div className={`px-6 py-4 border-t border-secondary-200 flex justify-end space-x-2 ${className}`}>
      {children}
    </div>
  );
};