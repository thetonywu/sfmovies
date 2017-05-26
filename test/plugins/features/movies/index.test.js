'use strict';

const Bluebird = require('bluebird');

const Knex            = require('../../../../lib/libraries/knex');
const LocationFactory = require('../../../factories/location');
const Movies          = require('../../../../lib/server');
const MovieFactory    = require('../../../factories/movie');

const movie1 = MovieFactory.build({ name: 'Star Trek', release_year: 1982 });
const movie2 = MovieFactory.build({ name: 'Star Trek 2', release_year: 1984 });
const movie3 = MovieFactory.build({ name: 'Star Trok', release_year: 1986 });

const location1 = LocationFactory.build({ name: 'Hayes Valley' });

describe('movies integration', () => {

  beforeEach(() => {
    return Bluebird.all([
      Knex.raw('TRUNCATE movies CASCADE'),
      Knex.raw('ALTER SEQUENCE movies_id_seq RESTART'),
      Knex.raw('TRUNCATE locations CASCADE'),
      Knex.raw('ALTER SEQUENCE locations_id_seq RESTART'),
      Knex.raw('TRUNCATE locations_movies CASCADE')
    ])
    .then(() => {
      return Bluebird.all([
        Knex('movies').insert([movie1, movie2, movie3]),
        Knex('locations').insert([location1])
      ]);
    });
  });

  describe('create', () => {

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

  describe('add_location', () => {

    it('associates a location with a movie', () => {
      return Movies.inject({
        url: '/movies/1/locations',
        method: 'POST',
        payload: { location: 1 }
      })
      .then((response) => {
        expect(response.statusCode).to.eql(200);
        expect(response.result.object).to.eql('movie');
        expect(response.result.locations[0].id).to.eql(1);
      });
    });

    it('returns 404 for invalid location', () => {
      return Movies.inject({
        url: '/movies/1/locations',
        method: 'POST',
        payload: { location: 10 }
      })
      .then((response) => {
        expect(response.statusCode).to.eql(404);
      });
    });

    it('returns 404 for invalid movie', () => {
      return Movies.inject({
        url: '/movies/10/locations',
        method: 'POST',
        payload: { location: 1 }
      })
      .then((response) => {
        expect(response.statusCode).to.eql(404);
      });
    });

  });

});
