'use strict';

const Factory = require('rosie').Factory;

module.exports = Factory.define('movie')
  .attr('name', '')
  .attr('release_year', 1900);
