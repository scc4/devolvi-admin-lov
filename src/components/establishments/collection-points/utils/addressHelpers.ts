
import type { CollectionPoint } from "@/types/collection-point";

export const getSimpleAddress = (point: CollectionPoint): string => {
  if (!point.address_obj) return point.address || "Endereço não disponível";

  const { street, number, district } = point.address_obj;
  const parts = [];

  if (street) parts.push(street);
  if (number) parts.push(number);
  if (district) parts.push(district);

  return parts.length > 0 ? parts.join(', ') : point.address || "Endereço não disponível";
};

export const getLocation = (point: CollectionPoint): string => {
  if (!point.address_obj) return "Localização desconhecida";

  const { city, state } = point.address_obj;
  const parts = [];

  if (city) parts.push(city);
  if (state) parts.push(state);

  return parts.length > 0 ? parts.join(' - ') : "Localização desconhecida";
};

export const getFullAddress = (point: CollectionPoint): string => {
  if (!point.address_obj) return point.address || "Endereço completo não disponível";

  const { street, number, complement, district, city, state, zip_code } = point.address_obj;
  const parts = [];

  if (street) parts.push(street);
  if (number) parts.push(number);
  if (complement) parts.push(complement);
  if (district) parts.push(district);
  if (city) parts.push(city);
  if (state) parts.push(state);
  if (zip_code) parts.push(`CEP: ${zip_code}`);

  return parts.length > 0 ? parts.join(', ') : point.address || "Endereço completo não disponível";
};
