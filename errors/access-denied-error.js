class AccessDeniedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AccessDenied';
    this.statusCode = 403;
  }
}

module.exports = AccessDeniedError;
