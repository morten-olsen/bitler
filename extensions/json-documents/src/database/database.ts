import { createDatabase, createMigration } from '@bitler/core';

const init = createMigration({
  name: 'init',
  up: async (knex) => {
    await knex.schema.createTable('documents', (table) => {
      table.string('id').primary();
      table.string('source').notNullable();
      table.string('type').notNullable();
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt').defaultTo(knex.fn.now());
      table.json('data').notNullable();
    });
  },
  down: async (knex) => {
    await knex.schema.dropTable('documents');
  },
});

const dbConfig = createDatabase({
  name: 'json-documents.data',
  migrations: [init],
});

export { dbConfig };
