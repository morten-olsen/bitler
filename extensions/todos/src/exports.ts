import { Capabilities, createExtension, Events } from '@bitlerjs/core';

import { todosFindCapability } from './capabilities/capabilities.find.js';
import { todosUpdateCapability } from './capabilities/capabilities.update.js';
import { todosCreateCapability } from './capabilities/capabilities.create.js';
import { todosUpdatedEvent } from './events/events.updated.js';

const todos = createExtension({
  setup: async ({ container }) => {
    const capabiliesService = container.get(Capabilities);
    capabiliesService.register([todosFindCapability, todosUpdateCapability, todosCreateCapability]);

    const eventsService = container.get(Events);
    eventsService.register([todosUpdatedEvent]);
  },
});

export { todos };
