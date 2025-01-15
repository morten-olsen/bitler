import { createCapability, z } from '@bitler/core';

import { LinearService } from '../servies/services.linear.js';
import { issueSchema } from '../schemas/schemas.js';
import { issuesContext } from '../contexts/issues.js';

const getIssue = createCapability({
  kind: 'linear.get-issue',
  name: 'Get issues',
  group: 'Linear',
  description: 'Get a specific issue from its ID',
  input: z.object({
    identifier: z.string().describe('The ID of the issue to get, in the format AAA-123'),
  }),
  output: z.object({
    issue: issueSchema,
  }),
  handler: async ({ container, context, input }) => {
    const { api } = container.get(LinearService);
    const response = await api.issue(input.identifier);
    const issue = issueSchema.parse(response);
    const currentIssues = context.get(issuesContext);
    context.set(issuesContext, [...(currentIssues || []), issue]);
    return {
      issue,
    };
  },
});

export { getIssue };
