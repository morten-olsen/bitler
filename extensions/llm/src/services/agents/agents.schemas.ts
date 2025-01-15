import { z } from '@bitler/core';

const agentSchema = z.object({
  kind: z.string(),
  name: z.string(),
  group: z.string().optional(),
  description: z.string().optional(),
  model: z.string().optional(),
  systemPrompt: z.string().optional(),
  discoverTasks: z.number().optional(),
  discoverAgents: z.number().optional(),
  capabilities: z.array(z.string()).optional(),
  agents: z.array(z.string()).optional(),
});

type Agent = z.infer<typeof agentSchema>;

export { agentSchema, type Agent };
