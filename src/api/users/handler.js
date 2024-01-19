const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');
class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async addUserHandler(req, h) {
    await this._validator.validateUserPayload(req.payload);
    const { username, password, fullname } = req.payload;
    const userId = await this._service.addUser({ username, password, fullname });

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async getUsersByUsernameHandler(req, h) {
    try {
      const { username = '' } = req.query;
      const users = await this._service.getUsersByUsername(username);
      return {
        status: 'success',
        message: 'data berhasil ditemukan',
        data: {
          users,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getUserByIdHandler(req, h) {
    const { id } = req.params;

    const user = await this._service.getUserById(id);

    const response = h.response({
      status: 'success',
      message: 'data berhasil ditemukan',
      data: {
        user,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = UsersHandler;
