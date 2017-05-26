'use strict';

const Controller            = require('./controller');
const LocationValidator     = require('../../../validators/movies/location');
const MoviesCreateValidator = require('../../../validators/movies/create');
const MoviesListValidator   = require('../../../validators/movies/list');

exports.register = (server, options, next) => {

  server.route([{
    method: 'POST',
    path: '/movies',
    config: {
      handler: (request, reply) => {
        reply(Controller.create(request.payload));
      },
      validate: {
        payload: MoviesCreateValidator
      }
    }
  }]);

  server.route([{
    method: 'POST',
    path: '/movies/{id}/locations',
    config: {
      handler: (request, reply) => {
        reply(Controller.addLocation(request.params.id, request.payload));
      },
      validate: {
        payload: LocationValidator
      }
    }
  }]);

  server.route([{
    method: 'GET',
    path: '/movies',
    config: {
      handler: (request, reply) => {
        reply(Controller.list(request.query));
      },
      validate: {
        query: MoviesListValidator
      }
    }
  }]);

  next();

};

exports.register.attributes = {
  name: 'movies'
};
