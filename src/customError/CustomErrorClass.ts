class CustomError extends Error {
  code: number;

  /**
   * Constructs a new instance of the CustomError class.
   *
   * @param {string} message - The error message.
   * @param {number} code - The error code.
   */
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    this.name = this.constructor.name;
  }
}

export default CustomError;
