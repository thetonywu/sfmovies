'use strict';

const Bluebird = require('bluebird');

const Controller      = require('../../../../lib/plugins/features/movies/controller');
const Knex            = require('../../../../lib/libraries/knex');
const LocationFactory = require('../../../factories/location');
const Movie           = require('../../../../lib/models/movie');
const MovieFactory    = require('../../../factories/movie');

const movie1 = MovieFactory.build({ name: 'Star Trek', release_year: 1982 });
const movie2 = MovieFactory.build({ name: 'Star Trek 2', release_year: 1984 });
const movie3 = MovieFactory.build({ name: 'Star Trok', release_year: 1986 });

const location1 = LocationFactory.build({ name: 'Hayes Valley' });

describe('movie controller', () => {

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
      const payload = { title: 'WALL-E' };

      return Controller.create(payload)
      .then((movie) => {
        expect(movie.get('title')).to.eql(payload.title);

        return new Movie({ id: movie.id }).fetch();
      })
      .then((movie) => {
        expect(movie.get('title')).to.eql(payload.title);
      });
    });

  });

  describe('list', () => {

    it('list movies released after year_start', () => {
      const payload = { year_start: 1983 };

      return Controller.list(payload)
      .then((movies) => {
        movies.map((movie) => {
          expect(movie.get('release_year')).to.be.at.least(1983);
        });
        expect(movies).to.have.length(2);
      });
    });

    it('list movies released before year_end', () => {
      const payload = { year_end: 1983 };

      return Controller.list(payload)
      .then((movies) => {
        movies.map((movie) => {
          expect(movie.get('release_year')).to.be.at.most(1983);
        });
        expect(movies).to.have.length(1);
      });
    });

    it('list movies released before year_end and after year_start', () => {
      const payload = { year_end: 1986, year_start: 1984 };

      return Controller.list(payload)
      .then((movies) => {
        movies.map((movie) => {
          expect(movie.get('release_year')).to.be.at.most(1986);
          expect(movie.get('release_year')).to.be.at.least(1984);
        });
        expect(movies).to.have.length(2);
      });
    });

    it('list movies that have "Trek" in the name', () => {
      const payload = { title: 'Trek' };

      return Controller.list(payload)
      .then((movies) => {
        movies.map((movie) => {
          expect(movie.get('name')).to.contain('Trek');
        });
        expect(movies).to.have.length(2);
      });
    });

    it('list all movies if no params are specified', () => {
      const payload = {};

      return Controller.list(payload)
      .then((movies) => {
        expect(movies).to.have.length(3);
      });
    });

  });

  describe('add_location', () => {

    it('associates a location with a movie', () => {
      const payload = { location: 1 };

      return Controller.addLocation(1, payload)
      .then((movie) => {
        expect(movie.get('id')).to.eql(1);

        return new Movie({ id: 1 }).fetch({
          withRelated: ['locations']
        });
      })
      .then((movie) => {
        expect(movie.related('locations').at(0).id).to.eql(1);
      });
    });

  });

});
