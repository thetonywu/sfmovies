'use strict';

const Location = require('../../lib/models/location');
const Movie    = require('../../lib/models/movie');

describe('movie model', () => {

  describe('serialize', () => {

    it('includes all of the necessary fields', () => {
      const movie = Movie.forge({ id: 1 });
      movie.related('locations').attach(Location.forge({ id: 1 }));
      const serial = movie.serialize();

      expect(serial).to.have.all.keys([
        'id',
        'title',
        'release_year',
        'locations',
        'object'
      ]);
    });

  });

});
