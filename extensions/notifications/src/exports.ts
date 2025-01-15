import { Capabilities, Events, createExtension } from '@bitlerjs/core';

import { addNotificationCapability } from './capabilities/capabilities.add.js';
import { listNotificationCapability } from './capabilities/capabilities.list.js';
import { removeNotificationsCapability } from './capabilities/capabilities.remove.js';
import { runNotificationActionCapability } from './capabilities/capabilities.run-action.js';
import { notificationRemovedEvent } from './events/events.removed.js';
import { notificationCreatedEvent } from './events/events.created.js';

const notifications = createExtension({
  setup: async ({ container }) => {
    const capabilitiesService = container.get(Capabilities);
    capabilitiesService.register([
      addNotificationCapability,
      listNotificationCapability,
      removeNotificationsCapability,
      runNotificationActionCapability,
    ]);

    const eventsService = container.get(Events);
    eventsService.register([notificationRemovedEvent, notificationCreatedEvent]);
  },
});

export { notifications, addNotificationCapability, removeNotificationsCapability };
