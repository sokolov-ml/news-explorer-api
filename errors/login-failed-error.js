class LoginFailedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'LoginFailed';
  }
}

module.exports = LoginFailedError;
