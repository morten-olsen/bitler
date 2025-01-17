import { createCapability, Databases, z } from '@bitlerjs/core';

import { todoSchema } from '../schemas/todo.js';
import { todosDb } from '../databases/databases.js';

const todosFindCapability = createCapability({
  kind: 'find',
  name: 'Find',
  group: 'Todos',
  description: 'Find todos',
  input: z.object({
    text: z.string().optional(),
    ids: z.array(z.string()).optional(),
    parents: z.array(z.string()).optional(),
    contexts: z.array(z.string()).optional(),
    projects: z.array(z.string()).optional(),
    offset: z.number().optional(),
    limit: z.number().optional(),
    updated: z
      .object({
        before: z.date().optional(),
        after: z.date().optional(),
      })
      .optional(),
    created: z
      .object({
        before: z.date().optional(),
        after: z.date().optional(),
      })
      .optional(),
    completed: z
      .object({
        is: z.boolean().optional(),
        before: z.date().optional(),
        after: z.date().optional(),
      })
      .optional(),
    dueDate: z
      .object({
        before: z.date().optional(),
        after: z.date().optional(),
      })
      .optional(),
    startDate: z
      .object({
        before: z.date().optional(),
        after: z.date().optional(),
      })
      .optional(),
  }),
  output: z.object({
    hasMore: z.boolean(),
    todos: z.array(todoSchema),
  }),
  handler: async ({ input, container }) => {
    const dbs = container.get(Databases);
    const db = await dbs.get(todosDb);

    let query = db('todos').select('*');

    if (input.text) {
      query = query.whereLike('text', input.text);
    }

    if (input.updated?.before) {
      query = query.where('updatedAt', '<', input.updated.before);
    }

    if (input.updated?.after) {
      query = query.where('updatedAt', '>', input.updated.after);
    }

    if (input.created?.before) {
      query = query.where('createdAt', '<', input.created.before);
    }

    if (input.created?.after) {
      query = query.where('createdAt', '>', input.created.after);
    }

    if (input.ids) {
      query = query.whereIn('id', input.ids);
    }

    if (input.contexts) {
      query = query.whereIn('contextId', input.contexts);
    }

    if (input.projects) {
      query = query.whereIn('projectId', input.projects);
    }

    if (input.parents) {
      query = query.whereIn('parentId', input.parents);
    }

    if (input.completed?.is !== undefined) {
      query = input.completed.is ? query.whereNotNull('completedAt') : query.whereNull('completedAt');
    }

    if (input.completed?.before) {
      query = query.where('completedAt', '<', input.completed.before);
    }

    if (input.completed?.after) {
      query = query.where('completedAt', '>', input.completed.after);
    }

    if (input.dueDate?.before) {
      query = query.where('dueDate', '<', input.dueDate.before);
    }

    if (input.dueDate?.after) {
      query = query.where('dueDate', '>', input.dueDate.after);
    }

    if (input.startDate?.before) {
      query = query.where('startDate', '<', input.startDate.before);
    }

    if (input.startDate?.after) {
      query = query.where('startDate', '>', input.startDate.after);
    }

    if (input.limit) {
      query = query.limit(input.limit);
    }

    if (input.offset) {
      query = query.offset(input.offset + 1);
    }

    const rows = await query;
    const hasMore = input.limit ? rows.length > input.limit : false;

    const result = input.limit ? rows.splice(0, input.limit) : rows;
    const tags = await db('tags').whereIn(
      'todoId',
      result.map((todo) => todo.id),
    );

    return {
      hasMore,
      todos: result.map((todo) => ({
        ...todo,
        tags: tags.filter((tag) => tag.todoId === todo.id).map((tag) => tag.name),
      })),
    };
  },
});

export { todosFindCapability };
