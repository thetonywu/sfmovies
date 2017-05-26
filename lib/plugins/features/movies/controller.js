'use strict';

const Bluebird = require('bluebird');
const Boom     = require('boom');

const Location = require('../../../models/location');
const Movie    = require('../../../models/movie');

exports.create = (payload) => {
  payload.name = payload.title;
  Reflect.deleteProperty(payload, 'title');
  return new Movie().save(payload)
  .then((movie) => {
    return new Movie({ id: movie.id }).fetch();
  });
};

exports.list = (query) => {
  return new Movie()
  .query((qb) => {
    if (query.year_end) {
      qb.where('release_year', '<=', query.year_end);
    }
    if (query.year_start) {
      qb.where('release_year', '>=', query.year_start);
    }
    if (query.title) {
      const nameLike = `%${query.title}%`;
      qb.where('name', 'LIKE', nameLike);
    }
  })
  .fetchAll();
};

exports.addLocation = (movieId, payload) => {
  return Bluebird.all([
    new Location({ id: payload.location }).fetch({ require: true }),
    new Movie({ id: movieId }).fetch({ require: true })
  ])
  .spread((location, movie) => {
    return movie.related('locations').attach(location);
  })
  .then(() => {
    return new Movie({ id: movieId }).fetch({
      withRelated: ['locations']
    });
  })
  .catch(Location.NotFoundError, (err) => {
    throw Boom.wrap(err, 404);
  })
  .catch(Movie.NotFoundError, (err) => {
    throw Boom.wrap(err, 404);
  });
};
