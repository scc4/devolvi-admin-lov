
interface IBGEState {
  id: number;
  sigla: string;
  nome: string;
}

interface IBGECity {
  id: number;
  nome: string;
}

export async function fetchStates(): Promise<IBGEState[]> {
  try {
    const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
    return await response.json();
  } catch (error) {
    console.error('Error fetching states:', error);
    return [];
  }
}

export async function fetchCitiesByState(uf: string): Promise<IBGECity[]> {
  try {
    const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
}
