export class AvailableSchedule {
  constructor(date: string, time: string, availableSlots: number) {
    this.date = date;
    this.time = time;
    this.availableSlots = availableSlots;
  }

  date: string;

  time: string;

  availableSlots: number;
}
