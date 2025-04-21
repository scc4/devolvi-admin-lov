
import type { CollectionPoint } from "@/types/collection-point";

const DAYS_OF_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

interface OpenStatus {
  isOpen: boolean;
  nextChange: {
    type: 'opens' | 'closes';
    time: string;
    day?: string;
  } | null;
}

export function checkOpenStatus(point: CollectionPoint): OpenStatus {
  if (!point.operating_hours) {
    return { isOpen: false, nextChange: null };
  }

  const now = new Date();
  const currentDay = DAYS_OF_WEEK[now.getDay()];
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const todayHours = point.operating_hours[currentDay] || [];
  
  // Check if currently open
  for (const period of todayHours) {
    if (currentTime >= period.open && currentTime < period.close) {
      return {
        isOpen: true,
        nextChange: {
          type: 'closes',
          time: period.close
        }
      };
    }
  }

  // Find next opening time
  // First check remaining periods today
  for (const period of todayHours) {
    if (currentTime < period.open) {
      return {
        isOpen: false,
        nextChange: {
          type: 'opens',
          time: period.open
        }
      };
    }
  }

  // Check next days
  let daysChecked = 0;
  let currentDayIndex = now.getDay();
  
  while (daysChecked < 7) {
    currentDayIndex = (currentDayIndex + 1) % 7;
    const nextDay = DAYS_OF_WEEK[currentDayIndex];
    const nextDayHours = point.operating_hours[nextDay] || [];
    
    if (nextDayHours.length > 0) {
      const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      return {
        isOpen: false,
        nextChange: {
          type: 'opens',
          time: nextDayHours[0].open,
          day: dayNames[currentDayIndex]
        }
      };
    }
    
    daysChecked++;
  }

  return { isOpen: false, nextChange: null };
}
