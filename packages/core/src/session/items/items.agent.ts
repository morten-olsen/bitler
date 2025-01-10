import { z } from "zod";
import { createSessionItem } from "../session.item.js";

const agentSession = createSessionItem({
  kind: 'agent',
  schema: z.object({
    agent: z.string().optional(),
    model: z.string(),
    capabilities: z.array(z.string()),
    agents: z.array(z.string()),
  }),
});

export { agentSession };
