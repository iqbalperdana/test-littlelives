import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Appointment } from 'src/common/entities/appointment.entity';
import { AvailableSchedule } from './dto/available-schedule.dto';
import { InvalidInputException } from 'src/common/exceptions/invalid-input.exception';

describe('SchedulesController', () => {
  let controller: SchedulesController;
  let service: SchedulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulesController],
      providers: [
        SchedulesService,
        {
          provide: getRepositoryToken(Appointment),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SchedulesController>(SchedulesController);
    service = module.get<SchedulesService>(SchedulesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAvailableSchedules', () => {
    it('should return available schedules for valid date', async () => {
      const date = new Date();
      const expectedSchedules: AvailableSchedule[] = [
        new AvailableSchedule('2024-01-01', '09:00', 1),
      ];

      jest
        .spyOn(service, 'getAvailableSchedules')
        .mockResolvedValue(expectedSchedules);

      const result = await controller.getAvailableSchedules(date.toISOString());
      expect(result).toEqual(expectedSchedules);
    });

    it('should throw InvalidInputException for invalid date', async () => {
      const invalidDate = 'invalid-date';

      jest.spyOn(service, 'getAvailableSchedules').mockImplementation(() => {
        throw new InvalidInputException('Invalid date');
      });

      await expect(
        controller.getAvailableSchedules(invalidDate),
      ).rejects.toThrow(InvalidInputException);
    });

    it('should throw InvalidInputException for past date', async () => {
      const pastDate = new Date('2020-01-01').toISOString();

      jest.spyOn(service, 'getAvailableSchedules').mockImplementation(() => {
        throw new InvalidInputException('Date cannot be in the past');
      });

      await expect(controller.getAvailableSchedules(pastDate)).rejects.toThrow(
        InvalidInputException,
      );
    });
  });
});
