import { Controller, Get, Query } from '@nestjs/common';
import { SchedulesService } from './schedules.service';

@Controller('api/schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get('available')
  async getAvailableSchedules(@Query('date') date: string) {
    const searchDate = new Date(date);
    return this.schedulesService.getAvailableSchedules(searchDate);
  }
}
