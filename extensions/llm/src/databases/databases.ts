import { createDatabase, createMigration } from '@bitlerjs/core';

const init = createMigration({
  name: 'init',
  up: async (knex) => {
    await knex.schema.createTable('agents', (table) => {
      table.string('kind').primary();
      table.string('name').notNullable();
      table.string('group').nullable();
      table.text('systemPrompt').nullable();
      table.text('description').nullable();
      table.string('model').nullable();
      table.integer('discoverCapabilities').nullable();
      table.integer('discoverAgents').nullable();
    });

    await knex.schema.createTable('agentCapabilities', (table) => {
      table.string('agentKind').notNullable().references('kind').inTable('agents').onDelete('CASCADE');
      table.string('capabilityKind').notNullable();
      table.primary(['agentKind', 'capabilityKind']);
    });

    await knex.schema.createTable('agentAgents', (table) => {
      table.string('agentKind').notNullable().references('kind').inTable('agents').onDelete('CASCADE');
      table.string('agentAgentKind').notNullable();
      table.primary(['agentKind', 'agentAgentKind']);
    });
  },
  down: async (knex) => {
    await knex.schema.dropTable('agentAgents');
    await knex.schema.dropTable('agentCapabilities');
    await knex.schema.dropTable('agents');
  },
});

const agentsDBConfig = createDatabase({
  name: 'llm.agents',
  migrations: [init],
});

export { agentsDBConfig };
