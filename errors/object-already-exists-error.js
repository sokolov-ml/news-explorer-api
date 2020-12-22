class ObjectAlreadyExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ObjectAlreadyExists';
    this.statusCode = 409;
  }
}

module.exports = ObjectAlreadyExistsError;
