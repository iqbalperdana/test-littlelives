import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentRepository } from './appointments.repository';
import { Appointment } from '../../common/entities/appointment.entity';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import { InvalidInputException } from 'src/common/exceptions/invalid-input.exception';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: AppointmentRepository,
  ) {}

  async book(appointmentForm: BookAppointmentDto): Promise<Appointment> {
    const checkDate = new Date(appointmentForm.date);
    checkDate.setHours(
      parseInt(appointmentForm.time.split(':')[0]),
      parseInt(appointmentForm.time.split(':')[1]),
      0,
      0,
    );
    // Check if there are already appointment under same name and day
    const currentAppointments = await this.appointmentRepository.find({
      where: {
        name: appointmentForm.name,
        date: checkDate,
      },
    });

    if (currentAppointments.length >= 1) {
      throw new InvalidInputException(
        'You already have an appointment for this time period',
      );
    }

    // Check for existing appointments in the same time slot
    const existingAppointments = await this.appointmentRepository.find({
      where: {
        date: checkDate,
      },
    });

    // Assuming max slots per time slot is 5 (can be moved to config)
    const maxSlots = parseInt(process.env.APP_APPOINTMENTS_SLOTS) || 1;
    const duration = parseInt(process.env.APP_APPOINTMENTS_DURATION) || 30;

    if (existingAppointments.length >= maxSlots) {
      throw new InvalidInputException(
        'No available slots for this time period',
      );
    }

    const newAppointment = new Appointment(
      appointmentForm.name,
      checkDate,
      duration,
    );
    return await this.appointmentRepository.save(newAppointment);
  }
}
