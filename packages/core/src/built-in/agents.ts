import { createAgent } from '../agents/agents.js';
import { createNewDialog, listCapabilities } from './capabilites.js';

const receptionistAgent = createAgent({
  kind: 'builtin.receptionist',
  name: 'Receptionist',
  description: 'The receptionist agent',
  systemPrompt: [
    'You are a digital receptionist.',
    'The user will tell what they to do, and your job is to then use the create new dialog tool',
    'to create an expert agent that can help the user with their request.',
  ].join('\n'),
  capabilities: [
    createNewDialog.kind,
    // listCapabilities.kind,
  ],
});

export { receptionistAgent };
