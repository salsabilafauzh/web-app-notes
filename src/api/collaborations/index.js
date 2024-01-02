const CollaborationsHandler = require('./handler');
const routes = require('./routes');
const registerCollaborations = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, { notesService, collaborationsService, validator }) => {
    const collaborationsHandler = new CollaborationsHandler(notesService, collaborationsService, validator);
    server.route(routes(collaborationsHandler));
  },
};

module.exports = registerCollaborations;
