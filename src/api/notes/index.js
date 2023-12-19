const NotesHandler = require('./handler.js');
const routes = require('./routes.js');

const registerNote = {
  name: 'notes',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const notesHandler = new NotesHandler(service, validator);
    server.route(routes(notesHandler));
  },
};

module.exports = registerNote;
