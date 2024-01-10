const { ExportNoteSchemaValidator } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');
const ExportNoteValidator = {
  validateExportNotesPayload: (payload) => {
    const validationResult = ExportNoteSchemaValidator.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ExportNoteValidator;
