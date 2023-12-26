const Hapi = require('@hapi/hapi');
const registerNote = require('./api/notes/index.js');
const registerUser = require('./api/users/index.js');
const NotesService = require('./services/postgres/NotesService.js');
const UsersService = require('./services/postgres/UsersService.js');
const NoteValidator = require('./validator/notes/index.js');
const UserValidator = require('./validator/users/index.js');
const ClientError = require('./exceptions/ClientError.js');
const dotenv = require('dotenv');
dotenv.config();

const init = async () => {
  try {
    const notesService = new NotesService();
    const usersService = new UsersService();
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
