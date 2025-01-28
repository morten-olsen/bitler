import { createDatabase, createMigration } from '@bitlerjs/core';

const init = createMigration({
  name: 'init',
  up: async (knex) => {
    await knex.schema.createTable('modules', (table) => {
      table.string('id').primary();
      table.string('name').notNullable();
      table.string('description').notNullable();
      table.string('code').notNullable();
      table.json('input').nullable();
      table.json('output').nullable();
    });

    await knex.schema.createTable('modulesAllowed', (table) => {
      table.string('from').notNullable();
      table.string('to').notNullable();
      table.primary(['from', 'to']);
    });
  },
  down: async (knex) => {
    await knex.schema.dropTable('modulesAllowed');
    await knex.schema.dropTable('modules');
  },
});

const dbConfig = createDatabase({
  name: 'typescript',
  migrations: [init],
});

export { dbConfig };
