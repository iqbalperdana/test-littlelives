import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/common/entities/appointment.entity';
import { Between } from 'typeorm';
import { AppointmentRepository } from '../appointments/appointments.repository';
import { AvailableSchedule } from './dto/available-schedule.dto';
import {
  formatTimeToString,
  formatDateToString,
  getDateDayLiteral,
} from 'src/common/utils/date.util';
import { InvalidInputException } from 'src/common/exceptions/invalid-input.exception';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: AppointmentRepository,
  ) {}

  async getAvailableSchedules(date: Date) {
    if (!date || isNaN(new Date(date).getTime())) {
      throw new InvalidInputException('Invalid date');
    }
    const startTime = new Date(date);
    startTime.setHours(0, 0, 0, 0);

    const endTime = new Date(date);
    endTime.setHours(23, 59, 59, 999);

    // Get all appointments for the given date
    const bookedAppointments = await this.appointmentRepository.find({
      where: {
        date: Between(startTime, endTime),
      },
    });

    // Count the number of appointments for each time slot
    const bookedTimeSlots = new Map<string, number>();
    bookedAppointments.forEach((appointment) => {
      const appointmentTime = new Date(appointment.date);
      const time =
        appointmentTime.getHours() + ':' + appointmentTime.getMinutes();
      const appointmentSlot = bookedTimeSlots.get(time);
      if (appointmentSlot) {
        bookedTimeSlots.set(time, appointmentSlot + 1);
      } else {
        bookedTimeSlots.set(time, 1);
      }
    });

    const availableTimeSlots = [];
    const startHour = parseInt(process.env.APP_SHCOOL_START_HOUR) || 9; // Start of business hours
    const endHour = parseInt(process.env.APP_SCHOOL_END_HOUR) || 17; // End of business hours
    const intervalMinutes =
      parseInt(process.env.APP_APPOINTMENTS_DURATION) || 30; // 1 hour slots
    let numberOfProvidedSlots =
      parseInt(process.env.APP_APPOINTMENTS_SLOTS) || 1;
    const holiday = ['saturday', 'sunday'];
    const offDates = process.env.APP_SCHOOL_OFF_DATES || [];

    // Check if the date is a holiday
    if (
      holiday.includes(getDateDayLiteral(date).toLowerCase()) ||
      offDates.includes(formatDateToString(date))
    ) {
      numberOfProvidedSlots = 0;
    }

    // Generate available time slots based on the booked time slots
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const timeSlot = new Date(date);
        timeSlot.setHours(hour, minute, 0, 0);

        if (timeSlot < new Date()) {
          continue;
        }

        const numberOfAvailableSlots =
          numberOfProvidedSlots -
          (bookedTimeSlots.get(hour + ':' + minute) || 0);

        availableTimeSlots.push(
          new AvailableSchedule(
            formatDateToString(timeSlot),
            formatTimeToString(timeSlot),
            numberOfAvailableSlots,
          ),
        );
      }
    }

    return availableTimeSlots;
  }
}
