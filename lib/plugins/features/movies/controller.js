'use strict';

const Movie = require('../../../models/movie');

exports.create = (payload) => {
  payload.name = payload.title;
  delete payload.title;
  return new Movie().save(payload)
  .then((movie) => {
    return new Movie({ id: movie.id }).fetch();
  });
};

exports.get = (query) => {
  return Movie.where("release_year", "<", query.release_year).fetchAll()
  .then((movies) => {
    return movies.toJSON();
  });
};
