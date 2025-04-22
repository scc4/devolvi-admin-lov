
import { useEffect } from "react";

interface DialogHandlersProps {
  isSubmitting: boolean;
  onClose: () => void;
}

export function useDialogHandlers({ isSubmitting, onClose }: DialogHandlersProps) {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      
      setTimeout(() => {
        document.body.style.pointerEvents = '';
        const overlays = document.querySelectorAll('[data-radix-portal]');
        overlays.forEach(overlay => {
          if (!overlay.contains(document.activeElement)) {
            (overlay as HTMLElement).style.display = 'none';
          }
        });
      }, 300);
    };
  }, [isSubmitting, onClose]);
}
