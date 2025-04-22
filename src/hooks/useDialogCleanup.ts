
import { useEffect } from "react";

interface UseDialogCleanupProps {
  open: boolean;
}

/**
 * Hook to properly clean up after dialog/modal closes
 * Fixes issues with pointer-events and lingering portal elements
 */
export function useDialogCleanup({ open }: UseDialogCleanupProps) {
  useEffect(() => {
    // Only run cleanup when dialog closes
    if (!open) {
      // Clean up any lingering portal elements and reset pointer-events
      const cleanup = () => {
        document.body.style.pointerEvents = '';
        
        // Find and clean up any stray radix portals
        const overlays = document.querySelectorAll('[data-radix-portal]');
        overlays.forEach(overlay => {
          if (!overlay.contains(document.activeElement)) {
            (overlay as HTMLElement).style.display = 'none';
          }
        });
      };
      
      // Execute cleanup with a small delay to ensure dialog animations complete
      const timeoutId = setTimeout(cleanup, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [open]);
}
