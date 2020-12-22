class LoginFailedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'LoginFailed';
    this.statusCode = 401;
  }
}

module.exports = LoginFailedError;
