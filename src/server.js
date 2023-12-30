const Hapi = require('@hapi/hapi');
const registerNote = require('./api/notes/index.js');
const registerUser = require('./api/users/index.js');
const registerAuth = require('./api/authentications/index.js');
const NotesService = require('./services/postgres/NotesService.js');
const UsersService = require('./services/postgres/UsersService.js');
const AuthService = require('./services/postgres/AuthService.js');
const NoteValidator = require('./validator/notes/index.js');
const UserValidator = require('./validator/users/index.js');
const AuthValidator = require('./validator/authentication/index.js');
const TokenManager = require('./tokenize/TokenManager.js');
const ClientError = require('./exceptions/ClientError.js');
const Jwt = require('@hapi/jwt');
const dotenv = require('dotenv');

dotenv.config();

const init = async () => {
  try {
    const notesService = new NotesService();
    const usersService = new UsersService();
    const authsService = new AuthService();

    const server = Hapi.server({
      port: process.env.PORT,
      host: process.env.HOST,
      routes: {
        cors: {
          origin: ['*'],
        },
      },
    });

    await server.register([
      {
        plugin: Jwt,
      },
    ]);

    server.auth.strategy('notesapp_jwt', 'jwt', {
      keys: process.env.ACCESS_TOKEN_KEY,
      verify: {
        aud: false,
        iss: false,
        sub: false,
        maxAgeSec: process.env.ACCESS_TOKEN_AGE,
      },
      validate: (artifacts) => ({
        isValid: true,
        credentials: {
          id: artifacts.decoded.payload.id,
        },
      }),
    });

    await server.register([
      {
        plugin: registerNote,
        options: {
          service: notesService,
          validator: NoteValidator,
        },
      },
      {
        plugin: registerUser,
        options: {
          service: usersService,
          validator: UserValidator,
        },
      },
      {
        plugin: registerAuth,
        options: {
          authenticationsService: authsService,
          usersService: usersService,
          tokenManager: TokenManager,
          validator: AuthValidator,
        },
      },
    ]);

    server.ext('onPreResponse', (req, h) => {
      const { response } = req;
      if (response instanceof Error) {
        if (response instanceof ClientError) {
          const newResponse = h.response({
            status: 'fail',
            message: response.message,
          });
          newResponse.code(response.statusCode);
          return newResponse;
        }

        if (!response.isServer) {
          return h.continue;
        }
        const newResponse = h.response({
          status: 'error',
          message: 'terjadi kegagalan pada server kami',
          optionalMessage: response.message,
        });
        newResponse.code(500);
        return newResponse;
      }

      return h.continue;
    });

    await server.start();
    console.log(`server running on port ${server.info.uri}..`);
  } catch (error) {
    console.log('disini:', error.message);
  }
};

init();
