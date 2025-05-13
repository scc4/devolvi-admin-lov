
import { useEffect } from "react";

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
  useEffect(() => {
    // Não precisamos fazer nada quando o diálogo abre
    if (open) return;

    // Efeitos de limpeza quando o diálogo fecha
    const timeout = setTimeout(() => {
      // Remove qualquer estilo de pointer-events persistente no body
      document.body.style.pointerEvents = '';
      
      // Encontra e esconde qualquer overlay de diálogo persistente
      const overlays = document.querySelectorAll('[data-radix-portal]');
      overlays.forEach(overlay => {
        if (!overlay.contains(document.activeElement)) {
          (overlay as HTMLElement).style.display = 'none';
        }
      });
      
      // Garante que o scroll esteja habilitado
      document.body.style.overflow = '';
      
      // Chama a função de limpeza personalizada, se fornecida
      if (onCleanup) {
        onCleanup();
      }
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [open, onCleanup]);
}
