import { ValidationError } from "class-validator";

type ErrorDetail = {
  field: string;
  constraints: string[];
};

const formatErrorDetails = (errorsArray: ValidationError[]): ErrorDetail[] =>
  errorsArray.map((dtoError) => ({
    field: dtoError.property,
    constraints: Object.values(dtoError.constraints ?? {}),
  }));

export { formatErrorDetails };
