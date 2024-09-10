interface CustomError extends Error {
  statusCode?: number;
}

export const ErrorHandler = (
  statusCode: number,
  message: string
): CustomError => {
  const error: CustomError = new Error(message);
  error.statusCode = statusCode;
  return error;
};
