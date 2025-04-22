
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
  const parts = [];
  if (point.street) parts.push(point.street);
  if (point.number) parts.push(point.number);
  if (point.complement) parts.push(point.complement);
  if (point.district) parts.push(point.district);
  if (point.zip_code) parts.push(`CEP: ${point.zip_code}`);
  if (point.city) parts.push(point.city);
  if (point.state) parts.push(point.state);
  
  return parts.length > 0 ? parts.join(', ') : point.address || "Não informado";
};
