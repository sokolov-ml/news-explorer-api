class ResourceNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ResourceNotFound';
  }
}

module.exports = ResourceNotFoundError;
