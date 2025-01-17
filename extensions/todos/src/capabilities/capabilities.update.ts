import { createCapability, Databases, Events, z } from '@bitlerjs/core';

import { todoEditSchema } from '../schemas/todo.js';
import { todosDb } from '../databases/databases.js';
import { todosUpdatedEvent } from '../events/events.updated.js';

const todosUpdateCapability = createCapability({
  kind: 'todos.set',
  name: 'Update',
  group: 'Todos',
  description: 'Update a todo',
  input: todoEditSchema,
  output: z.object({
    success: z.boolean(),
  }),
  handler: async ({ input, container }) => {
    const { tags, id, ...todo } = input;
    const dbs = container.get(Databases);
    const db = await dbs.get(todosDb);
    const now = new Date();

    await db.transaction(async (trx) => {
      await trx('todos')
        .update({
          ...todo,
          updatedAt: now,
        })
        .where('id', id);
      if (tags) {
        await trx('tags').where('todoId', id).delete();
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
        updatedAt: now,
        createdAt: now, // TODO: fix
        tags,
      },
    });

    return {
      success: true,
    };
  },
});

export { todosUpdateCapability };
