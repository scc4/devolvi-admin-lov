
import { CollectionPoint, DayOfWeek, daysOfWeekPtBr } from "@/types/collection-point";

export const formatOperatingHours = (hours: CollectionPoint['operating_hours']) => {
  if (!hours) return "Não informado";
  
  const daysInOrder: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'sunday', 'saturday'];
  
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
  if (!point.address) return "Não informado";
  return point.address;
};
