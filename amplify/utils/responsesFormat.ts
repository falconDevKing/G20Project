export const successResponseCreator = (statusCode: number, message: string, results: any) => {
  console.log("success response", {
    message,
    statusCode,
    error: false,
    data: results,
  });

  return {
    message,
    statusCode,
    error: false,
    data: results,
  };
};
export const errorResponseCreator = (statusCode: number, message: string, errors: any) => {
  // List of common HTTP request code
  const codes = [200, 201, 400, 401, 404, 403, 422, 500];
  // Get matched code
  const findCode = codes.find((code) => code === statusCode);
  if (!findCode) statusCode = 500;
  else statusCode = findCode;
  return {
    errors,
    message,
    statusCode,
    error: true,
  };
};
