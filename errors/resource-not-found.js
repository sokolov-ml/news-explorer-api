class ResourceNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ResourceNotFound';
    this.statusCode = 404;
  }
}

module.exports = ResourceNotFoundError;
