import { ActionRequest } from "../action-requests/action-requests.action.js";
import { ActionRequests } from "../action-requests/action-requests.js";
import { Capability } from "../capabilities/capabilities.capability.js"
import { Capabilities } from "../capabilities/capabilities.js";
import { Event, Events } from "../events/events.js";
import { Agent, Agents, Container, ContextItem, ContextItems } from "../exports.js";

type ExtensionSetupOptions = {
  container: Container;
}

type Extension = {
  setup?: (options: ExtensionSetupOptions) => Promise<void>;
  events?: Event<any, any>[];
  actionRequests?: ActionRequest<any>[];
  contexts?: ContextItem<any>[];
  capabilities?: Capability<any, any>[];
  agents?: Agent[];
}

class Extensions {
  #container: Container;

  constructor(container: Container) {
    this.#container = container;
  }

  public register = async (extensions: Extension[]) => {
    const contextItemService = this.#container.get(ContextItems);
    const capabilitesService = this.#container.get(Capabilities);
    const agentsService = this.#container.get(Agents);
    const actionRequestService = this.#container.get(ActionRequests);

    for (const extension of extensions) {
      if (extension.contexts) {
        contextItemService.register(extension.contexts);
      }
      if (extension.capabilities) {
        capabilitesService.register(extension.capabilities);
      }
      if (extension.agents) {
        agentsService.register(extension.agents);
      }
      if (extension.setup) {
        await extension.setup({ container: this.#container });
      }
      if (extension.actionRequests) {
        actionRequestService.register(extension.actionRequests);
      }
      if (extension.events) {
        const eventsService = this.#container.get(Events);
        eventsService.register(extension.events);
      }
    }
  }
}

const createExtension = (ext: Extension) => ext;

export { createExtension, type Extension, Extensions }
