import { createMigration, createDatabase } from '@bitlerjs/core';

const init = createMigration({
  name: 'init',
  up: async (knex) => {
    await knex.schema.createTable('contexts', (table) => {
      table.string('id').primary();
      table.string('name').notNullable();
      table.string('color').nullable();
      table.string('description').nullable();
    });

    await knex.schema.createTable('projects', (table) => {
      table.string('id').primary();
      table.string('name').notNullable();
      table.string('description').nullable();
    });

    await knex.schema.createTable('todos', (table) => {
      table.string('id').primary();
      table.string('parentId').nullable().references('id').inTable('todos').onDelete('CASCADE');
      table.string('contextId').nullable().references('id').inTable('contexts').onDelete('SET NULL');
      table.string('projectId').nullable().references('id').inTable('projects').onDelete('SET NULL');
      table.string('ownerId').nullable();
      table.string('assigneeId').nullable();
      table.string('title').notNullable();
      table.string('description').nullable();
      table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
      table.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now());
      table.dateTime('deletedAt').nullable();
      table.dateTime('completedAt').nullable();
      table.date('dueDate').nullable();
      table.time('dueTime').nullable();
      table.date('startDate').nullable();
      table.time('startTime').nullable();
    });

    await knex.schema.createTable('tags', (table) => {
      table.string('todoId').notNullable().references('id').inTable('todos').onDelete('CASCADE');
      table.string('name').notNullable();
      table.primary(['todoId', 'name']);
    });
  },
  down: async (knex) => {
    await knex.schema.dropTable('tags');
    await knex.schema.dropTable('todos');
    await knex.schema.dropTable('projects');
    await knex.schema.dropTable('contexts');
  },
});

const todosDb = createDatabase({
  name: 'todos',
  migrations: [init],
});

export { todosDb };
