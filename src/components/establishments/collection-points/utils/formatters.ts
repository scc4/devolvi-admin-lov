import { CollectionPoint, DayOfWeek, daysOfWeekPtBr } from "@/types/collection-point";

export const formatOperatingHours = (hours: CollectionPoint['operating_hours']) => {
  if (!hours) return "Não informado";
  
  const daysInOrder: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  return daysInOrder
    .map(day => {
      const dayName = daysOfWeekPtBr[day];
      const periods = hours[day];
      
      if (!periods || periods.length === 0) {
        return `${dayName}: Fechado`;
      }
      
      const timeRanges = periods.map(p => `${p.open} às ${p.close}`).join(', ');
      return `${dayName}: ${timeRanges}`;
    })
    .join('\n');
};

export const formatAddress = (point: CollectionPoint) => {
  if (!point.address_obj) return "Não informado";
  
  const { street, number, complement, district, city, state, zip_code } = point.address_obj;
  const parts = [];
  
  if (street) parts.push(street);
  if (number) parts.push(number);
  if (complement) parts.push(complement);
  if (district) parts.push(district);
  if (city) parts.push(city);
  if (state) parts.push(state);
  if (zip_code) parts.push(`CEP: ${zip_code}`);
  
  return parts.length > 0 ? parts.join(', ') : "Não informado";
};
