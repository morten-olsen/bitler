import { dialogCreateNewCapability } from '../capabilities/dialog/dialog.create.js';
import { createAgent } from '../services/agents/agents.js';

const receptionistAgent = createAgent({
  kind: 'builtin.receptionist',
  name: 'Receptionist',
  description: 'The receptionist agent',
  systemPrompt: [
    'You are a digital receptionist.',
    'The user will tell what they to do, and your job is to then use the create new dialog tool',
    'to create an expert agent that can help the user with their request.',
  ].join('\n'),
  capabilities: [dialogCreateNewCapability.kind],
});

export { receptionistAgent };
