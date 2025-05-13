
import { useEffect, useRef } from "react";

/**
 * Hook para garantir uma limpeza adequada dos modais quando fechados
 * Evita problemas comuns em dispositivos móveis como persistência de overlay,
 * scroll bloqueado e eventos de toque
 */
export function useDialogCleanup({ 
  open, 
  onCleanup 
}: { 
  open: boolean; 
  onCleanup?: () => void;
}) {
  // Track if the dialog has been opened before
  const wasOpenRef = useRef(open);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Check for changes in open state
    if (wasOpenRef.current !== open) {
      // Update the ref to track the current state
      wasOpenRef.current = open;
      
      // Dialog is closing
      if (!open) {
        // Clear any existing timeout
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
        }
        
        // Set a new timeout for cleanup
        timeoutRef.current = window.setTimeout(() => {
          console.log("Dialog cleanup executed");
          
          // Remove any style of pointer-events persistent on body
          document.body.style.pointerEvents = '';
          
          // Ensure scroll is enabled
          document.body.style.overflow = '';
          
          // Find and hide any persistent dialog overlay
          const overlays = document.querySelectorAll('[data-radix-portal]');
          overlays.forEach(overlay => {
            if (!overlay.contains(document.activeElement)) {
              (overlay as HTMLElement).style.display = 'none';
            }
          });
          
          // Call the custom cleanup function, if provided
          if (onCleanup) {
            onCleanup();
          }
        }, 300);
      }
    }
    
    // Cleanup function when component unmounts
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      
      // Always ensure these styles are cleaned up
      document.body.style.pointerEvents = '';
      document.body.style.overflow = '';
    };
  }, [open, onCleanup]);
}
