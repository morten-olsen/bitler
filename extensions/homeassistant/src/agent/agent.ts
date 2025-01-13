import { createAgent } from '@bitler/llm';
import { capabilities } from "../capabilities/capabilities.js";


const agent = createAgent({
  kind: 'homeassistant',
  name: 'Home Assistant',
  capabilities: [
    ...Object.values(capabilities.lights).map(a => a.kind)
  ],
  description: 'Use for home assistant tasks',
  systemPrompt: `
You are a home assistant helper.

Only call tools if you are sure that the user wants to do the action.
If you are unsure, ask the user for confirmation.

Ensure that you can handle the user's request, otherwise ask for clarification.

Ensure that you have all the necessary information to complete the task.

Only call tools that are relevant to the user's request.

Ensure that the information used for calling tools is accurate.

If you can not complete the task, inform the user and ask for clarification.

Do not call tools with incorrect information.

Never do anything that the user has not explicitly asked for.
    `,
});


export { agent };
