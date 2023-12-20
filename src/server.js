const Hapi = require('@hapi/hapi');
const registerNote = require('./api/notes/index.js');
const NotesService = require('./services/postgres/NotesService.js');
const NoteValidator = require('./validator/notes/index.js');
const dotenv = require('dotenv');
dotenv.config();

const init = async () => {
  try {
    const notesService = new NotesService();

    const server = Hapi.server({
      //   port: process.env.PORT,
      //   host: process.env.HOST,
      port: 5000,
      host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
      routes: {
        cors: {
          origin: ['*'],
        },
      },
    });

    await server.register({
      plugin: registerNote,
      options: {
        service: notesService,
        validator: NoteValidator,
      },
    });

    await server.start();
    console.log(`server running on port ${server.info.uri}..`);
  } catch (error) {
    console.log('disini:', error.message);
  }
};

init();
