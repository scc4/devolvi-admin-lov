
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
    if (!response.ok) {
      throw new Error(`Failed to fetch states: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error('States API did not return an array:', data);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching states:', error);
    return [];
  }
}

export async function fetchCitiesByState(uf: string): Promise<IBGECity[]> {
  if (!uf) {
    console.error('No UF provided to fetch cities');
    return [];
  }
  
  try {
    const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`);
    if (!response.ok) {
      throw new Error(`Failed to fetch cities: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error('Cities API did not return an array:', data);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
}
