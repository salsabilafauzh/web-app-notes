class ClientError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ClientError';
  }
}

export default ClientError;
