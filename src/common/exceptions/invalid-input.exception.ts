import { HttpException, HttpStatus } from '@nestjs/common';

const DEFAULT_MESSAGE = 'Invalid input.';

export class InvalidInputException extends HttpException {
  constructor(message: string = DEFAULT_MESSAGE) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
