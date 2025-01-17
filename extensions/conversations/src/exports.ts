import { Capabilities, createExtension, Events } from '@bitlerjs/core';

import { promptCapability } from './capabilities/capabilities.prompt.js';
import { conversationSubscriptionEvent } from './events/events.updated.js';
import { syncConversationCapability } from './capabilities/capabilities.sync.js';
import { removeMessagesCapability } from './capabilities/capabilities.remove-messages.js';
import { retryMessageCapability } from './capabilities/capabilities.retry-message.js';
import { listConversationsCapability } from './capabilities/capabilities.list.js';
import { setSettingsCapability } from './capabilities/capabilities.set-settings.js';

const conversations = createExtension({
  setup: async ({ container }) => {
    const capabilitiesService = container.get(Capabilities);
    capabilitiesService.register([
      promptCapability,
      syncConversationCapability,
      removeMessagesCapability,
      retryMessageCapability,
      listConversationsCapability,
      setSettingsCapability,
    ]);

    const eventsService = container.get(Events);
    eventsService.register([conversationSubscriptionEvent]);
  },
});

export { conversations };
