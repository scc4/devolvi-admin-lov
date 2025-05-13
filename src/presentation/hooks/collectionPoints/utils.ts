
import { toast } from "sonner";

/**
 * Funções auxiliares para manipulação de pontos de coleta
 */

/**
 * Exibe uma mensagem de erro de toast apropriada baseada no erro capturado
 */
export const handleCollectionPointError = (
  err: unknown, 
  defaultMessage: string = 'Erro desconhecido ao processar pontos de coleta'
): string => {
  console.error(defaultMessage, err);
  const errorMessage = err instanceof Error ? err.message : defaultMessage;
  
  toast.error(defaultMessage, {
    description: errorMessage
  });
  
  return errorMessage;
};

/**
 * Verifica se uma requisição foi abortada
 */
export const isRequestAborted = (abortController: AbortController | null): boolean => {
  return abortController?.signal.aborted || false;
};
