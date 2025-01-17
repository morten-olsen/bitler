import { createDatabase, createMigration } from '@bitlerjs/core';

const init = createMigration({
  name: 'init',
  up: async (knex) => {
    await knex.schema.createTable('conversations', (table) => {
      table.string('id').primary();
      table.string('name').nullable();
      table.text('description', 'longtext').nullable();
      table.boolean('pinned').defaultTo(false);
      table.dateTime('createdAt').defaultTo(knex.fn.now()).notNullable();
      table.dateTime('updatedAt').defaultTo(knex.fn.now()).notNullable();
      table.string('agent').nullable();
      table.text('systemPrompt', 'longtext').nullable();
      table.integer('discoverCapabilies').defaultTo(0);
      table.integer('discoverAgents').defaultTo(0);
      table.json('context').nullable();
    });

    await knex.schema.createTable('conversationCapabilities', (table) => {
      table.string('conversationId').notNullable().references('id').inTable('conversations').onDelete('CASCADE');
      table.string('capability').notNullable();
      table.primary(['conversationId', 'capability']);
    });

    await knex.schema.createTable('conversationAgents', (table) => {
      table.string('conversationId').notNullable().references('id').inTable('conversations').onDelete('CASCADE');
      table.string('agentId').notNullable();
      table.primary(['conversationId', 'agentId']);
    });

    await knex.schema.createTable('messages', (table) => {
      table.string('id').primary();
      table.string('conversationId').notNullable().references('id').inTable('conversations').onDelete('CASCADE');
      table.string('role').notNullable();
      table.text('content').notNullable();
      table.dateTime('createdAt').notNullable();
    });
  },
  down: async (knex) => {
    await knex.schema.dropTable('conversations');
    await knex.schema.dropTable('conversationCapabilities');
    await knex.schema.dropTable('conversationAgents');
    await knex.schema.dropTable('messages');
  },
});

const extendMessageLength = createMigration({
  name: 'extendMessageLength',
  up: async (knex) => {
    await knex.schema.alterTable('messages', (table) => {
      table.text('content', 'longtext').notNullable().alter();
    });
  },
  down: async (knex) => {
    await knex.schema.alterTable('messages', (table) => {
      table.string('content').notNullable().alter();
    });
  },
});

const dbConfig = createDatabase({
  name: 'core.history',
  migrations: [init, extendMessageLength],
});

export { dbConfig };
