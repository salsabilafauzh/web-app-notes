const Joi = require('joi');

const ExportNoteSchemaValidator = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = { ExportNoteSchemaValidator };
