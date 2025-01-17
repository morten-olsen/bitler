import { createEvent, z } from '@bitlerjs/core';

import { todoSchema } from '../schemas/todo.js';

const todosUpdatedEvent = createEvent({
  kind: 'todos.updated',
  name: 'Updated',
  group: 'Todos',
  description: 'A todo was updated',
  input: z.object({
    ids: z.array(z.string()),
  }),
  output: z.object({
    from: todoSchema.optional(),
    to: todoSchema.optional(),
  }),
});

export { todosUpdatedEvent };
