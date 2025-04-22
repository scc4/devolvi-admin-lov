
import { useState } from "react";

/**
 * Hook para consultar CEPs na API ViaCEP
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

      // Usando a API ViaCEP que é mais estável e amplamente utilizada
      const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
      if (!response.ok) {
        setError("CEP não encontrado.");
        setIsFetching(false);
        return null;
      }
      const data = await response.json();
      
      // Verificar se o CEP existe pelo retorno da API ViaCEP
      if (data.erro) {
        setError("CEP não encontrado.");
        setIsFetching(false);
        return null;
      }
      
      setIsFetching(false);
      return {
        rua: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
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
