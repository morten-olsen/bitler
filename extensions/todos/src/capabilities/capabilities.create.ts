import { createCapability, createId, Databases, Events, z } from '@bitlerjs/core';

import { todoCreateSchema } from '../schemas/todo.js';
import { todosDb } from '../databases/databases.js';
import { todosUpdatedEvent } from '../events/events.updated.js';

const todosCreateCapability = createCapability({
  kind: 'todos.create',
  name: 'Create',
  group: 'Todos',
  description: 'Create a todo',
  input: todoCreateSchema,
  output: z.object({
    id: z.string(),
    success: z.boolean(),
  }),
  handler: async ({ input, container }) => {
    const id = createId();
    const { tags, ...todo } = input;
    const dbs = container.get(Databases);
    const db = await dbs.get(todosDb);
    const now = new Date();

    await db.transaction(async (trx) => {
      await trx('todos').insert({
        ...todo,
        id,
        createdAt: now,
        updatedAt: now,
      });
      if (tags) {
        await trx('tags').insert(
          tags.map((name) => ({
            todoId: id,
            name,
          })),
        );
      }
    });

    const events = container.get(Events);
    events.publish(todosUpdatedEvent, {
      to: {
        id,
        ...todo,
        createdAt: now,
        updatedAt: now,
        tags,
      },
    });

    return {
      id,
      success: true,
    };
  },
});

export { todosCreateCapability };
