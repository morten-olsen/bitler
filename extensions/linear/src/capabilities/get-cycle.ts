import { createCapability, z } from '@bitlerjs/core';

import { LinearService } from '../servies/services.linear.js';
import { userContext, userContextSetup } from '../contexts/user.js';
import { issueSchema } from '../schemas/schemas.js';
import { issuesContext } from '../contexts/issues.js';

const getCycles = createCapability({
  kind: 'linear.my-issues',
  name: 'My Issues',
  group: 'Linear',
  description: 'The issues assigned to the current user',
  input: z.object({}),
  setup: [userContextSetup],
  output: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
    }),
  ),
  handler: async ({ container, context }) => {
    const linearService = container.get(LinearService);
    const api = await linearService.getApi();
    const currentUser = context.get(userContext);
    if (!currentUser) {
      throw new Error('No user context');
    }
    const response = await api.cycles({});
    const issues = response.nodes.map((a) => issueSchema.parse(a));
    const currentIssues = context.get(issuesContext);
    context.set(issuesContext, [...(currentIssues || []), ...issues]);
    return issues;
  },
});

export { getCycles };
