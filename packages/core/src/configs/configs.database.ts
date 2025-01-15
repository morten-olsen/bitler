import { createDatabase, createMigration } from '../databases/databases.js';

const init = createMigration({
  name: 'init',
  up: async (knex) => {
    await knex.schema.createTable('configs', (table) => {
      table.string('kind').primary();
      table.json('value');
    });
  },
  down: async (knex) => {
    await knex.schema.dropTable('configs');
  },
});

const dbConfig = createDatabase({
  name: 'configs',
  migrations: [init],
});

export { dbConfig };
