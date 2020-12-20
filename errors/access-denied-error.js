class AccessDeniedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AccessDenied';
  }
}

module.exports = AccessDeniedError;
