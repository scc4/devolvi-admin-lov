
import type { CollectionPoint, Address } from "@/types/collection-point";

export const getSimpleAddress = (point: CollectionPoint & { address?: Address | null }): string => {
  if (!point.address) return "Endereço não disponível";

  const { street, number, district } = point.address;
  const parts = [];

  if (street) parts.push(street);
  if (number) parts.push(number);
  if (district) parts.push(district);

  return parts.length > 0 ? parts.join(', ') : "Endereço não disponível";
};

export const getLocation = (point: CollectionPoint & { address?: Address | null }): string => {
  if (!point.address) return "Localização desconhecida";

  const { city, state } = point.address;
  const parts = [];

  if (city) parts.push(city);
  if (state) parts.push(state);

  return parts.length > 0 ? parts.join(' - ') : "Localização desconhecida";
};

export const getFullAddress = (point: CollectionPoint & { address?: Address | null }): string => {
  if (!point.address) return "Endereço completo não disponível";

  const { street, number, complement, district, city, state, zip_code } = point.address;
  const parts = [];

  if (street) parts.push(street);
  if (number) parts.push(number);
  if (complement) parts.push(complement);
  if (district) parts.push(district);
  if (city) parts.push(city);
  if (state) parts.push(state);
  if (zip_code) parts.push(`CEP: ${zip_code}`);

  return parts.length > 0 ? parts.join(', ') : "Endereço completo não disponível";
};
