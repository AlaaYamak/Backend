class APIError extends Error {
  statusCode;
  message;
  constructor(message, statusCode) {
    super(message)
    this.message = message
    this.statusCode = statusCode
  }
}

module.exports = APIError;