import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentController } from './appointments.controller';
import { AppointmentService } from './appointments.service';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import { Appointment } from '../../common/entities/appointment.entity';
import { InvalidInputException } from 'src/common/exceptions/invalid-input.exception';

describe('AppointmentController', () => {
  let controller: AppointmentController;
  let service: AppointmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentController],
      providers: [
        {
          provide: AppointmentService,
          useValue: {
            book: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AppointmentController>(AppointmentController);
    service = module.get<AppointmentService>(AppointmentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('bookAppointment', () => {
    it('should successfully book an appointment', async () => {
      const appointmentForm: BookAppointmentDto = {
        name: 'John Doe',
        date: '2023-12-25',
        time: '14:30',
      };

      const expectedResult = new Appointment(
        appointmentForm.name,
        new Date('2023-12-25T14:30:00'),
        30,
      );

      jest.spyOn(service, 'book').mockResolvedValue(expectedResult);

      const result = await controller.bookAppointment(appointmentForm);
      expect(result).toBe(expectedResult);
      expect(service.book).toHaveBeenCalledWith(appointmentForm);
    });

    it('should throw InvalidInputException when booking duplicate appointment', async () => {
      const appointmentForm: BookAppointmentDto = {
        name: 'John Doe',
        date: '2023-12-25',
        time: '14:30',
      };

      jest
        .spyOn(service, 'book')
        .mockRejectedValue(
          new InvalidInputException(
            'You already have an appointment for this time period',
          ),
        );

      await expect(controller.bookAppointment(appointmentForm)).rejects.toThrow(
        InvalidInputException,
      );
    });

    it('should throw InvalidInputException when no slots available', async () => {
      const appointmentForm: BookAppointmentDto = {
        name: 'John Doe',
        date: '2023-12-25',
        time: '14:30',
      };

      jest
        .spyOn(service, 'book')
        .mockRejectedValue(
          new InvalidInputException('No available slots for this time period'),
        );

      await expect(controller.bookAppointment(appointmentForm)).rejects.toThrow(
        InvalidInputException,
      );
    });
  });
});
