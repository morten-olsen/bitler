import { Capabilities, ContextItems, createExtension } from '@bitlerjs/core';
import { Agents } from '@bitlerjs/llm';

import { profile } from './capabilities/profile.js';
import { agent } from './agents/agent.js';
import { userContext } from './contexts/user.js';
import { myIssues } from './capabilities/my-issues.js';
import { getIssue } from './capabilities/get-issue.js';
import { issuesContext } from './contexts/issues.js';

const linear = createExtension({
  setup: async ({ container }) => {
    const agentsService = container.get(Agents);
    agentsService.register([agent]);

    const contextItemsService = container.get(ContextItems);
    contextItemsService.register([userContext, issuesContext]);

    const capabilitiesService = container.get(Capabilities);
    capabilitiesService.register([profile, myIssues, getIssue]);
  },
});

export { linear };
