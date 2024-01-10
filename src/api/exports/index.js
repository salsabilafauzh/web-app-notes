const ExportHandle = require('./handler');
const routes = require('./routes');
const registerExports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const exportHandler = new ExportHandle(service, validator);

    server.route(routes(exportHandler));
  },
};

module.exports = registerExports;
