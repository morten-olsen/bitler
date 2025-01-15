import { DatabaseMigration } from '@bitlerjs/core';
const init: DatabaseMigration = {
  name: 'init',
  up: async (knex) => {
    await knex.schema.createTable('timers', (table) => {
      table.string('id').primary();
      table.string('owner').nullable();
      table.string('description').nullable();
      table.integer('duration').notNullable();
      table.dateTime('start').notNullable();
    });
  },
  down: async (knex) => {
    await knex.schema.dropTable('timers');
  },
};

export { init };
