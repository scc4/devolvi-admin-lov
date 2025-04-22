
import { useState } from "react";

/**
 * Hook para consultar CEPs na API https://api.cep.scc4.com.br/cep/{cep}
 * @returns 
 */
export function useCepLookup() {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string|null>(null);

  async function fetchCep(cep: string) {
    setIsFetching(true);
    setError(null);

    try {
      // Remove qualquer caractere não numérico antes de buscar
      const cleanedCep = cep.replace(/\D/g, "");
      if (cleanedCep.length !== 8) {
        setError("CEP inválido. Digite 8 dígitos.");
        setIsFetching(false);
        return null;
      }

      const response = await fetch(`https://api.cep.scc4.com.br/cep/${cleanedCep}`);
      if (!response.ok) {
        setError("CEP não encontrado.");
        setIsFetching(false);
        return null;
      }
      const data = await response.json();
      // Validação simples de estrutura mínima da resposta
      if (!data.rua || !data.bairro || !data.cidade || !data.estado) {
        setError("Dados incompletos no resultado do CEP.");
        setIsFetching(false);
        return null;
      }
      setIsFetching(false);
      return {
        rua: data.rua,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
      };
    } catch (e) {
      setError("Não foi possível buscar o CEP. Tente novamente.");
      setIsFetching(false);
      return null;
    }
  }

  return {
    fetchCep,
    isFetching,
    error,
    setError,
  };
}
