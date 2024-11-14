import { Controller, Post, Body } from '@nestjs/common';
import { AppointmentService } from './appointments.service';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import { Appointment } from '../../common/entities/appointment.entity';

@Controller('api/appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  async bookAppointment(
    @Body() appointmentForm: BookAppointmentDto,
  ): Promise<Appointment> {
    return await this.appointmentService.book(appointmentForm);
  }
}
