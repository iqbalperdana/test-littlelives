import { Repository, DataSource } from 'typeorm';
import { Appointment } from '../../common/entities/appointment.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppointmentRepository extends Repository<Appointment> {
  constructor(private dataSource: DataSource) {
    super(Appointment, dataSource.createEntityManager());
  }

  async checkExistingAppointment(
    name: string,
    date: Date,
  ): Promise<Appointment[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const appointments = await this.createQueryBuilder()
      .where('name = :name', { name })
      .andWhere('date BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      })
      .getMany();
    return appointments;
  }
}
