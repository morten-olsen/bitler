import { ServerSchema } from '@bitlerjs/client';
import {} from '@tanstack/react-query';

import { createMutationHooks } from './client.mutation.js';
import { createQueryHooks } from './client.query.js';
import { createEventHooks } from './client.event.js';

const createTypedHooks = <T extends ServerSchema>() => {
  const queryhooks = createQueryHooks<T>();
  const mutationHooks = createMutationHooks<T>();
  const eventHooks = createEventHooks<T>();
  return {
    ...queryhooks,
    ...mutationHooks,
    ...eventHooks,
  };
};

export * from './client.event.js';
export * from './client.mutation.js';
export * from './client.query.js';
export { createTypedHooks };
