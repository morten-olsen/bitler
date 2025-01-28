import {
  describeCapabilitiesCapability,
  findCapabilitiesCapability,
  listCapabilitiesCapability,
} from '../capabilities/capabilities.capabilities.js';
import { Capabilities } from '../capabilities/capabilities.js';
import { Events } from '../events/events.js';
import { ContextItems } from '../contexts/contexts.js';
import { createExtension } from '../extensions/extensions.js';
import { currentTimeContext } from '../time/time.context.js';
import {
  describeActionRequestsCapability,
  listActionRequestsCapability,
} from '../action-requests/action-requests.capabilities.js';
import { capabilitiesUpdatedEvent } from '../capabilities/capabilities.events.js';
import {
  configsUpdatedEvent,
  configValueChangedEvent,
  describeConfigsCapability,
  getConfigCapability,
  listConfigsCapability,
  removeConfigCapability,
  setConfigCapability,
} from '../configs/configs.capabilities.js';
import {
  contextItemsUpdatedEvent,
  describeContextItemsCapability,
  listContextItemsCapability,
} from '../contexts/contexts.capabilities.js';
import { listEventsCapability } from '../events/events.capabilities.js';

const capabilities = {
  listActionRequests: listActionRequestsCapability,
  describeActionRequest: describeActionRequestsCapability,
  listContextItems: listContextItemsCapability,
  describeContextItem: describeContextItemsCapability,
  listEvents: listEventsCapability,
  describeCapabilities: describeCapabilitiesCapability,
  listCapabilities: listCapabilitiesCapability,
  findCapability: findCapabilitiesCapability,
  describeCapability: describeCapabilitiesCapability,
  listConfigs: listConfigsCapability,
  describeConfigs: describeConfigsCapability,
  setConfigValue: setConfigCapability,
  getConfigValue: getConfigCapability,
  removeConfigValue: removeConfigCapability,
};

const events = {
  configsUpdated: configsUpdatedEvent,
  capabilitiesUpdated: capabilitiesUpdatedEvent,
  contextItemsUpdated: contextItemsUpdatedEvent,
  configValueChanged: configValueChangedEvent,
};

const builtIn = createExtension({
  setup: async ({ container }) => {
    const capabilitiesService = container.get(Capabilities);
    const contextItemsService = container.get(ContextItems);

    contextItemsService.register([currentTimeContext]);

    capabilitiesService.register(Object.values(capabilities));

    const eventsService = container.get(Events);
    eventsService.register(Object.values(events));
  },
});

export { builtIn, capabilities, configValueChangedEvent, events };
