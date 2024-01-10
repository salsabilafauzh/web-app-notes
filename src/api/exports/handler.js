const autoBind = require('auto-bind');

class ExportHandle {
  constructor(exportService, validator) {
    this._exportService = exportService;
    this._validator = validator;
    autoBind(this);
  }

  async postExportNotesHandler(req, h) {
    this._validator.validateExportNotesPayload(req.payload);

    const message = {
      userId: req.auth.credentials.id,
      targetEmail: req.payload.targetEmail,
    };

    await this._exportService.sendMessage('export:notes', JSON.stringify(message));
    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportHandle;
