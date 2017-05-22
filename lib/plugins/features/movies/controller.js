'use strict';

const Movie = require('../../../models/movie');

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
