import { createCapability, z } from '@bitlerjs/core';

import { SignalService } from '../services/services.signal.js';

const sendCapability = createCapability({
  kind: 'signal.send',
  name: 'Send Signal Message',
  group: 'Signal',
  description: 'Send a message to a Signal contact',
  input: z.object({
    recipient: z.string().describe("The recipient's phone number"),
    message: z.string(),
    attachments: z
      .array(z.string())
      .optional()
      .describe(
        'Base64 encoded attachments ("<BASE64 ENCODED DATA>", "data:<MIME-TYPE>;base64<comma><BASE64 ENCODED DATA>", "data:<MIME-TYPE>;filename=<FILENAME>;base64<comma><BASE64 ENCODED DATA>")',
      ),
  }),
  output: z.object({
    success: z.boolean(),
  }),
  handler: async ({ container, input }) => {
    const signalService = container.get(SignalService);
    const accounts = await signalService.getAccounts();
    await signalService.post('/v2/send', {
      body: {
        base64_attachments: input.attachments,
        number: accounts[0],
        recipients: [input.recipient],
        message: input.message,
      },
    });
    return { success: true };
  },
});

export { sendCapability };
