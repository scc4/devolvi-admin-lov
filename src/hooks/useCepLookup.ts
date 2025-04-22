
import { useState } from "react";

/**
 * Hook para consultar CEPs na API SCC4
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

      // Usando a API SCC4 conforme solicitado
      const response = await fetch(`https://api.cep.scc4.com.br/cep/${cleanedCep}`);
      if (!response.ok) {
        setError("CEP não encontrado.");
        setIsFetching(false);
        return null;
      }
      const data = await response.json();
      
      // Verificar se o CEP existe pela estrutura mínima da resposta
      if (!data.logradouro || !data.bairro || !data.cidade || !data.uf) {
        setError("Dados incompletos no resultado do CEP.");
        setIsFetching(false);
        return null;
      }
      
      setIsFetching(false);
      return {
        rua: data.logradouro,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.uf,
      };
    } catch (e) {
      console.error("Erro ao buscar o CEP:", e);
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
