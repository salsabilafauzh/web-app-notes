const ClientError = require('./ClientError.js');

class InvariantError extends ClientError {
  constructor(message) {
    super(message, 400);
    this.name = 'InvariantError';
  }
}

module.exports = InvariantError;
