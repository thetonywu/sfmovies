'use strict';

const Knex         = require('../../../../lib/libraries/knex');
const Movies       = require('../../../../lib/server');
const MovieFactory = require('../../../factories/movie');

const movie1 = MovieFactory.build({ name: 'Star Trek', release_year: 1982 });
const movie2 = MovieFactory.build({ name: 'Star Trek 2', release_year: 1984 });
const movie3 = MovieFactory.build({ name: 'Star Trok', release_year: 1986 });

describe('movies integration', () => {

  describe('create', () => {

    beforeEach(() => {
      return Knex.raw('TRUNCATE movies CASCADE')
      .then(() => Knex('movies').insert([movie1, movie2, movie3]));
    });

    it('creates a movie', () => {
      return Movies.inject({
        url: '/movies',
        method: 'POST',
        payload: { title: 'Volver' }
      })
      .then((response) => {
        expect(response.statusCode).to.eql(200);
        expect(response.result.object).to.eql('movie');
      });
    });

  });

  describe('list', () => {

    it('gets movies after year_start (inclusive)', () => {
      return Movies.inject({
        url: '/movies?year_start=1980',
        method: 'GET'
      })
      .then((response) => {
        expect(response.statusCode).to.eql(200);
        response.result.map((movie) => expect(movie.object).to.eql('movie'));
        expect(response.result).to.be.length(3);
      });
    });

  });

});
