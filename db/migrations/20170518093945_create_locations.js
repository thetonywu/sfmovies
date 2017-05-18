'use strict';

exports.up = function (Knex, Promise) {
  return Knex.schema.createTable('locations', (table) => {
    table.increments('id').primary();
    table.text('name').notNullable();
  });
};

exports.down = function (Knex, Promise) {
  return Knex.schema.dropTable('locations');
};
