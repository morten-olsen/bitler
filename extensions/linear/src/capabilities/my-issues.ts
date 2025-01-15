import { createCapability, z } from '@bitler/core';

import { LinearService } from '../servies/services.linear.js';
import { userContext, userContextSetup } from '../contexts/user.js';
import { issueSchema } from '../schemas/schemas.js';
import { issuesContext } from '../contexts/issues.js';

const myIssues = createCapability({
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
    const { api } = container.get(LinearService);
    const currentUser = context.get(userContext);
    if (!currentUser) {
      throw new Error('No user context');
    }
    const response = await api.issues({
      filter: {
        assignee: {
          id: {
            eq: currentUser.id,
          },
        },
        completedAt: {
          null: true,
        },
        canceledAt: {
          null: true,
        },
      },
    });
    const issues = response.nodes.map((a) => issueSchema.parse(a));
    const currentIssues = context.get(issuesContext);
    context.set(issuesContext, [...(currentIssues || []), ...issues]);
    return issues;
  },
});

export { myIssues };
