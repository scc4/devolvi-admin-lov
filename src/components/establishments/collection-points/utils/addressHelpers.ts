
import type { CollectionPoint } from "@/types/collection-point";

export const getSimpleAddress = (point: CollectionPoint): string => {
  // Log for debugging
  console.log(`getSimpleAddress called for point ID: ${point.id}`);
  console.log(`point.address_obj:`, point.address_obj);
  
  if (!point.address_obj) {
    console.log(`Point ${point.id} missing address_obj, returning fallback address`);
    return point.address || "Endereço não disponível";
  }

  const { street, number, district } = point.address_obj;
  const parts = [];

  if (street) parts.push(street);
  if (number) parts.push(number);
  if (district) parts.push(district);

  const result = parts.length > 0 ? parts.join(', ') : "Endereço não disponível";
  console.log(`getSimpleAddress result: ${result}`);
  return result;
};

export const getLocation = (point: CollectionPoint): string => {
  // Log for debugging
  console.log(`getLocation called for point ID: ${point.id}`);
  console.log(`point.address_obj:`, point.address_obj);

  if (!point.address_obj) {
    console.log(`Point ${point.id} missing address_obj, returning fallback location`);
    
    // Try to extract location from address string if available
    if (point.address && point.address.includes('-')) {
      const parts = point.address.split('-');
      if (parts.length >= 2) {
        const locationPart = parts[parts.length - 1].trim();
        console.log(`Extracted location from address string: ${locationPart}`);
        return locationPart;
      }
    }
    
    return "Localização desconhecida";
  }

  const { city, state } = point.address_obj;
  const parts = [];

  if (city) parts.push(city);
  if (state) parts.push(state);

  const result = parts.length > 0 ? parts.join(' - ') : "Localização desconhecida";
  console.log(`getLocation result: ${result}`);
  return result;
};

export const getFullAddress = (point: CollectionPoint): string => {
  // Log for debugging
  console.log(`getFullAddress called for point ID:`, point.id);
  console.log(`point.address_obj:`, point.address_obj);
  
  if (!point.address_obj) {
    console.log(`Point missing address_obj, returning fallback address`);
    return point.address || "Endereço completo não disponível";
  }

  const { street, number, complement, district, city, state, zip_code } = point.address_obj;
  const parts = [];

  if (street) parts.push(street);
  if (number) parts.push(number);
  if (complement) parts.push(complement);
  if (district) parts.push(`${district}`);
  if (city) parts.push(city);
  if (state) parts.push(state);
  if (zip_code) parts.push(`CEP: ${zip_code}`);

  const result = parts.length > 0 ? parts.join(', ') : "Endereço completo não disponível";
  console.log(`getFullAddress result: ${result}`);
  return result;
};
