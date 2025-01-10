import { DatabaseMigration } from "@bitler/core";

const init: DatabaseMigration = {
  name: 'init',
  up: async (knex) => {
    await knex.schema.createTable('agents', (table) => {
      table.string('kind').primary();
      table.string('name').notNullable();
      table.string('group').nullable();
      table.string('description').notNullable();
      table.string('systemPrompt').nullable();
      table.integer('discoverCapabilities').nullable();
      table.integer('discoverAgents').nullable();
    });

    await knex.schema.createTable('agentCapabilities', (table) => {
      table.string('agentKind').references('kind').inTable('agents').notNullable().onDelete('CASCADE');
      table.string('capabilityKind').notNullable();
    });

    await knex.schema.createTable('agentSubAgents', (table) => {
      table.string('agentKind').references('kind').inTable('agents').notNullable().onDelete('CASCADE');
      table.string('subAgentKind').notNullable();
    });
  },
  down: async (knex) => {
    await knex.schema.dropTable('agentSubAgents');
  }
}
const migrations = [init];

export { migrations };
