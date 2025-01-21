import { Capabilities } from '../capabilities/capabilities.js';
import { Events } from '../events/events.js';
import { createExtension } from '../extensions/extensions.js';

import { describeActionRequestsCapability, listActionRequestsCapability } from './action-requests.js';
import {
  describeCapabilitiesCapability,
  findCapabilitiesCapability,
  listCapabilitiesCapability,
} from './capabilites.js';
import {
  configsUpdatedEvent,
  configValueChangedEvent,
  describeConfigsCapability,
  getConfigCapability,
  listConfigsCapability,
  removeConfigCapability,
  setConfigCapability,
} from './configs.js';
import {
  contextItemsUpdatedEvent,
  describeContextItemsCapability,
  listContextItemsCapability,
} from './context-items.js';
import { listEventsCapability } from './events.js';
import { capabilitiesUpdatedEvent } from './events/capabilites.js';

const builtIn = createExtension({
  setup: async ({ container }) => {
    const capabilitiesService = container.get(Capabilities);

    capabilitiesService.register([
      listActionRequestsCapability,
      describeActionRequestsCapability,
      listContextItemsCapability,
      describeContextItemsCapability,
      listEventsCapability,
      describeCapabilitiesCapability,
      listCapabilitiesCapability,
      findCapabilitiesCapability,
      describeCapabilitiesCapability,
      listConfigsCapability,
      describeConfigsCapability,
      setConfigCapability,
      getConfigCapability,
      removeConfigCapability,
    ]);

    const eventsService = container.get(Events);
    eventsService.register([
      configsUpdatedEvent,
      capabilitiesUpdatedEvent,
      contextItemsUpdatedEvent,
      configValueChangedEvent,
    ]);
  },
});

export { builtIn, configValueChangedEvent };
