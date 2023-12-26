const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.addUserHandler,
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: handler.getUserByIdHandler,
  },
];

module.exports = routes;
