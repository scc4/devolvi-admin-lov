
import { useEffect } from "react";

/**
 * Hook to ensure proper cleanup of modals when closed
 * Avoids common issues on mobile devices like overlay persistence,
 * blocked scroll, and touch events
 */
export function useDialogCleanup({ 
  open, 
  onCleanup 
}: { 
  open: boolean; 
  onCleanup?: () => void;
}) {
  useEffect(() => {
    // No need to do anything when dialog opens
    if (open) return;

    // Cleanup effects when dialog closes
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
      
      // Call custom cleanup function if provided
      if (onCleanup) {
        onCleanup();
      }
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [open, onCleanup]);
}
