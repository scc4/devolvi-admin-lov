
import { useEffect } from "react";

/**
 * Hook para garantir a limpeza adequada de modais quando fechados
 * Evita problemas comuns em dispositivos móveis como sobreposição,
 * scroll bloqueado e eventos de toque
 */
export function useDialogCleanup({ open }: { open: boolean }) {
  useEffect(() => {
    // Cleanup effects when dialog closes
    if (!open) {
      // Adiciona timeout para permitir que as animações terminem
      const timeout = setTimeout(() => {
        // Remove any lingering pointer-events style on body
        document.body.style.pointerEvents = '';
        
        // Find and hide any stray dialog overlays
        const overlays = document.querySelectorAll('[data-radix-portal]');
        overlays.forEach(overlay => {
          if (!overlay.contains(document.activeElement)) {
            (overlay as HTMLElement).style.display = 'none';
          }
        });
        
        // Guarantee scroll is enabled
        document.body.style.overflow = '';
      }, 300);
      
      return () => clearTimeout(timeout);
    }
  }, [open]);
}
