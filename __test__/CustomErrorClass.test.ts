import CustomError from '@/customError/CustomErrorClass';

describe('CustomError', () => {
  it('should create a new CustomError instance with correct message and code', () => {
    const errorMessage = 'Test Error Message';
    const errorCode = 404;

    const customError = new CustomError(errorMessage, errorCode);

    expect(customError.message).toBe(errorMessage);
    expect(customError.code).toBe(errorCode);
  });

  it('should set the name of the error to "CustomError"', () => {
    const errorMessage = 'Test Error Message';
    const errorCode = 404;

    const customError = new CustomError(errorMessage, errorCode);

    expect(customError.name).toBe('CustomError');
  });
});
