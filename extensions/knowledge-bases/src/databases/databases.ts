import { FeatureExtractor, createDatabase, createMigration } from '@bitler/core';

import { MODEL } from '../consts.js';

const init = createMigration({
  name: 'init',
  up: async (knex, { container }) => {
    const featureExtractor = container.get(FeatureExtractor);
    const embeddedField = await featureExtractor.getFieldType(MODEL);

    await knex.schema.createTable('knowledgeBases', (table) => {
      table.string('id').notNullable().primary();
      table.string('name').notNullable();
    });

    await knex.schema.createTable('documents', (table) => {
      table.string('id').unique().notNullable();
      table.string('knowledgeBaseId').notNullable().references('knowledgeBases.id').onDelete('CASCADE');
      table.string('title').notNullable();
      table.string('content').notNullable();
      table.string('createdAt').defaultTo(knex.fn.now()).notNullable();
      table.string('updatedAt').defaultTo(knex.fn.now()).notNullable();
      table.primary(['id', 'knowledgeBaseId']);
    });

    await knex.schema.createTable('chunks', (table) => {
      table.string('documentId').notNullable().references('documents.id').onDelete('CASCADE');
      table.string('chunkId').notNullable();
      table.string('knowledgeBaseId').notNullable().references('knowledgeBases.id').onDelete('CASCADE');
      table.specificType('embedding', embeddedField).notNullable();
      table.integer('start').nullable();
      table.integer('end').nullable();
      table.primary(['knowledgeBaseId', 'documentId', 'chunkId']);
    });
  },
  down: async (knex) => {
    await knex.schema.dropTableIfExists('knowledge_bases');
  },
});
const dbConfig = createDatabase({
  name: 'knowledge-bases',
  migrations: [init],
});

export { dbConfig };
