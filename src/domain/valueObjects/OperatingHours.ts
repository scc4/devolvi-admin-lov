
import { DayOfWeek, daysOfWeek } from "../../types/collection-point";

/**
 * Value Object representing a time slot
 */
export class TimeSlot {
  readonly open: string;
  readonly close: string;

  constructor(open: string, close: string) {
    this.validateTimeFormat(open);
    this.validateTimeFormat(close);
    this.validateTimeOrder(open, close);
    
    this.open = open;
    this.close = close;
  }

  private validateTimeFormat(time: string): void {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!regex.test(time)) {
      throw new Error(`Invalid time format: ${time}. Expected format is HH:MM in 24-hour format.`);
    }
  }

  private validateTimeOrder(open: string, close: string): void {
    if (open >= close) {
      throw new Error(`Closing time (${close}) must be after opening time (${open}).`);
    }
  }

  /**
   * Check if a given time is within this time slot
   */
  isTimeWithinSlot(time: string): boolean {
    return time >= this.open && time <= this.close;
  }

  /**
   * Get the duration of this time slot in minutes
   */
  getDurationMinutes(): number {
    const [openHour, openMin] = this.open.split(':').map(Number);
    const [closeHour, closeMin] = this.close.split(':').map(Number);
    
    return (closeHour * 60 + closeMin) - (openHour * 60 + openMin);
  }

  /**
   * Format the time slot as a string
   */
  toString(): string {
    return `${this.open} - ${this.close}`;
  }

  /**
   * Check if this time slot equals another time slot
   */
  equals(other: TimeSlot): boolean {
    return this.open === other.open && this.close === other.close;
  }
}

/**
 * Value Object representing operating hours for each day of the week
 */
export class OperatingHours {
  private readonly schedule: Record<DayOfWeek, TimeSlot[]>;

  constructor(schedule: Partial<Record<DayOfWeek, TimeSlot[]>> = {}) {
    // Initialize schedule with empty arrays for each day
    this.schedule = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    };

    // Add provided time slots
    for (const day of daysOfWeek) {
      if (schedule[day] && schedule[day]!.length > 0) {
        this.schedule[day] = [...schedule[day]!];
      }
    }
  }

  /**
   * Add a time slot to a specific day
   */
  addTimeSlot(day: DayOfWeek, timeSlot: TimeSlot): OperatingHours {
    const updatedSchedule = { ...this.schedule };
    updatedSchedule[day] = [...updatedSchedule[day], timeSlot];
    
    // Sort time slots by opening time
    updatedSchedule[day].sort((a, b) => a.open.localeCompare(b.open));
    
    return new OperatingHours(updatedSchedule);
  }

  /**
   * Remove a time slot from a specific day
   */
  removeTimeSlot(day: DayOfWeek, index: number): OperatingHours {
    if (index < 0 || index >= this.schedule[day].length) {
      throw new Error(`Invalid time slot index: ${index}`);
    }
    
    const updatedSchedule = { ...this.schedule };
    updatedSchedule[day] = updatedSchedule[day].filter((_, i) => i !== index);
    
    return new OperatingHours(updatedSchedule);
  }

  /**
   * Get all time slots for a specific day
   */
  getTimeSlotsForDay(day: DayOfWeek): TimeSlot[] {
    return this.schedule[day];
  }

  /**
   * Check if a location is open on a specific day and time
   */
  isOpenAt(day: DayOfWeek, time: string): boolean {
    const timeSlots = this.schedule[day];
    return timeSlots.some(slot => slot.isTimeWithinSlot(time));
  }

  /**
   * Get the complete schedule
   */
  getSchedule(): Record<DayOfWeek, TimeSlot[]> {
    return { ...this.schedule };
  }

  /**
   * Convert to a regular object for serialization
   */
  toJSON(): Record<string, { open: string; close: string }[]> {
    const result: Record<string, { open: string; close: string }[]> = {};
    
    for (const day of daysOfWeek) {
      result[day] = this.schedule[day].map(slot => ({
        open: slot.open,
        close: slot.close
      }));
    }
    
    return result;
  }

  /**
   * Create from a JSON object
   */
  static fromJSON(json: Record<string, { open: string; close: string }[]> | null): OperatingHours {
    if (!json) {
      return new OperatingHours();
    }
    
    const schedule: Partial<Record<DayOfWeek, TimeSlot[]>> = {};
    
    for (const day of daysOfWeek) {
      if (json[day]) {
        schedule[day as DayOfWeek] = json[day].map(
          slot => new TimeSlot(slot.open, slot.close)
        );
      }
    }
    
    return new OperatingHours(schedule);
  }
}
