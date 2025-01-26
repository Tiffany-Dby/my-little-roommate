export class CustomError extends Error {
  statusCode: number;
  errorCode: string;
  details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    errorCode: string,
    details?: any
  ) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }
}
