import { createAgent } from "@bitler/core";
import { getContactsCapability, getGroupsCapability } from "../exports.js";
import { sendCapability } from "../capabilities/send.js";

const agent = createAgent({
  kind: 'signal',
  name: 'Signal',
  description: 'Signal Agent',
  capabilities: [
    getContactsCapability.kind,
    getGroupsCapability.kind,
    sendCapability.kind,
  ],
})

export { agent };
