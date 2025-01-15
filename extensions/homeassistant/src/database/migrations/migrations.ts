import { DatabaseMigration } from '@bitlerjs/core';

const init: DatabaseMigration = {
  name: 'init',
  up: async (knex) => {
    await knex.schema.createTable('rooms', (table) => {
      table.string('id').primary();
      table.string('lightGroup').nullable();
    });

    await knex.schema.createTable('room_names', (table) => {
      table.string('room_id').references('rooms.id');
      table.string('name');
      table.primary(['room_id', 'name']);
    });
  },
  down: async (knex) => {
    await knex.schema.dropTable('room_names');
    await knex.schema.dropTable('rooms');
  },
};

const addMediaPlayers: DatabaseMigration = {
  name: 'addMediaPlayers',
  up: async (knex) => {
    await knex.schema.alterTable('rooms', (table) => {
      table.string('mediaPlayers').nullable();
    });
  },
  down: async (knex) => {
    await knex.schema.alterTable('rooms', (table) => {
      table.dropColumn('mediaPlayers');
    });
  },
};
const migrations = [init, addMediaPlayers];

export { migrations };
