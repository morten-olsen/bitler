import { createDatabase, createMigration } from '../databases/databases.js';

const init = createMigration({
  name: 'init',
  up: async (knex) => {
    await knex.schema.createTable('files', (table) => {
      table.string('hash').notNullable();
      table.date('createdAt').notNullable();
      table.string('contentType').notNullable();
    });

    await knex.schema.alterTable('leases', (table) => {
      table.string('id').primary();
      table.string('hash').notNullable().references('hash').inTable('files').onDelete('CASCADE');
      table.date('expiresAt').nullable();
      table.string('owner').nullable();
    });
  },
  down: async (knex) => {
    await knex.schema.dropTable('leases');
    await knex.schema.dropTable('files');
  },
});

const dbConfig = createDatabase({
  name: 'files',
  migrations: [init],
});

export { dbConfig };
