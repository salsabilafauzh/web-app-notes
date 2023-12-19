const { NotePayloadsSchema } = require('./schema.js');
const InvariantError = require('../../exceptions/InvariantError.js');
const NoteValidator = {
  validateNotePayload: (payload) => {
    const validationResult = NotePayloadsSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = NoteValidator;
