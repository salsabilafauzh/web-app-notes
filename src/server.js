import Hapi from '@hapi/hapi';
import registerNote from './api/notes/index.js';
import NotesService from './services/inMemory/NotesService.js';
import NoteValidator from './validator/notes/index.js';
const init = async () => {
  try {
    const notesService = new NotesService();

    const server = Hapi.server({
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
    console.log(error.message);
  }
};

init();
