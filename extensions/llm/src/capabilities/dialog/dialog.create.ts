import { createCapability, z } from "@bitler/core";
import { capabilitiesContextSetup } from "../../contexts/capabilites.js";
import { createDialogOptionsSchema, createDialogRequest } from "../../action-requests/create-dialog.js";


const dialogCreateNewCapability = createCapability({
  kind: 'dialog.create-new',
  name: 'Create New Dialog',
  group: 'DIalog',
  setup: [
    capabilitiesContextSetup,
  ],
  description: 'Create a new dialog',
  input: createDialogOptionsSchema,
  output: z.object({
    success: z.boolean(),
  }),
  handler: async ({ input, actionRequests }) => {
    actionRequests.request(createDialogRequest, input);
    return { success: true };
  },
});

export { dialogCreateNewCapability };
