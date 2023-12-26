const InvariantError = require('../../exceptions/InvariantError');
const { UserPayloadsSchema } = require('./schema');

const UserValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadsSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UserValidator;
