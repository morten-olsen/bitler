import { Capabilities, Configs, createExtension, Events } from '@bitlerjs/core';
import { modelsConfig } from '@bitlerjs/llm';

import { promptCapability } from './capabilities/capabilities.prompt.js';
import { conversationSubscriptionEvent } from './events/events.updated.js';
import { syncConversationCapability } from './capabilities/capabilities.sync.js';
import { removeMessagesCapability } from './capabilities/capabilities.remove-messages.js';
import { retryMessageCapability } from './capabilities/capabilities.retry-message.js';
import { listConversationsCapability } from './capabilities/capabilities.list.js';
import { setSettingsCapability } from './capabilities/capabilities.set-settings.js';

const capabilities = {
  promptCapability,
  syncConversationCapability,
  removeMessagesCapability,
  retryMessageCapability,
  listConversationsCapability,
  setSettingsCapability,
};

const events = {
  conversationSubscriptionEvent,
};

const conversations = createExtension({
  setup: async ({ container }) => {
    const configsService = container.get(Configs);
    const capabilitiesService = container.get(Capabilities);
    const eventsService = container.get(Events);
    eventsService.register([conversationSubscriptionEvent]);

    configsService.use(modelsConfig, (config) => {
      if (!config) {
        capabilitiesService.unregister([
          promptCapability.kind,
          syncConversationCapability.kind,
          removeMessagesCapability.kind,
          retryMessageCapability.kind,
          listConversationsCapability.kind,
          setSettingsCapability.kind,
        ]);
      } else {
        capabilitiesService.register([
          promptCapability,
          syncConversationCapability,
          removeMessagesCapability,
          retryMessageCapability,
          listConversationsCapability,
          setSettingsCapability,
        ]);
      }
    });
  },
});

export { conversations, capabilities, events };
