import { createDatabase, createMigration } from "../../databases/databases.js";

const init = createMigration({
  name: 'init',
  up: async (knex) => {
    await knex.schema.createTable('conversations', (table) => {
      table.string('id').primary();
      table.string('name').nullable();
      table.string('description').nullable();
      table.boolean('pinned').defaultTo(false);
      table.dateTime('createdAt').defaultTo(knex.fn.now()).notNullable();
      table.dateTime('updatedAt').defaultTo(knex.fn.now()).notNullable();
      table.string('agent').nullable();
      table.string('systemPrompt').nullable();
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
      table.string('content').notNullable();
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

const dbConfig = createDatabase({
  name: 'core.history',
  migrations: [init],
});

export { dbConfig };
