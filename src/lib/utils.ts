
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Função de utilidade para limpar estados de DOM relacionados a modais
 * Útil para corrigir problemas com modais que persistem no DOM
 */
export function cleanupModalDOM() {
  // Restaurar eventos de ponteiro no body
  document.body.style.pointerEvents = '';
  
  // Restaurar scroll no body
  document.body.style.overflow = '';
  
  // Limpar portais de modais que podem estar persistindo
  const overlays = document.querySelectorAll('[data-radix-portal]');
  overlays.forEach(overlay => {
    if (!overlay.contains(document.activeElement)) {
      (overlay as HTMLElement).style.display = 'none';
    }
  });
  
  // Remover classes de bloqueio de scroll que podem ter sido adicionadas
  document.body.classList.remove('overflow-hidden');
}
