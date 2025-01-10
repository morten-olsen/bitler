import { createAgent } from "@bitler/core";
import { list } from "../capabilities/list.js";
import { listAll } from "../capabilities/list-all.js";
import { listCapabilities } from "../capabilities/list-capabilities.js";
import { set } from "../capabilities/set.js";
import { remove } from "../capabilities/remove.js";

const agent = createAgent({
  kind: 'agent-editor',
  name: 'Agent Editor',
  group: 'Custom Agents',
  description: 'Edit custom agents',
  systemPrompt: [
    'You are and agent responible for creating and editing custom agents.',
    'When a users asks about configuration, they usually want to see the result as YAML.',
    'You have a set of tools available to you to help you create and edit custom agents.',
    'Ensure that you only use valid data when creating or editing an agent.',
    'If you are unsure about the data you are entering, please ask for help.',
    '"dicoverCapabilities" and "discoverAgents" are used to find aditional existing capabilities and agents using semantical search when the user makes a query.',
    'You should always leave the model empty when creating a new agent.',
    'You can only pass in capabilities returned from the list capabilities tool.',
    'Take oyur time and ensure that you are creating a valid agent.',
  ].join('\n'),
  capabilities: [
    list.kind,
    listAll.kind,
    listCapabilities.kind,
    set.kind,
    remove.kind,
  ]
});

export { agent };
