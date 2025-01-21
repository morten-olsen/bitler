import { Capabilities, Configs, ContextItems, createExtension } from '@bitlerjs/core';
import { Agents } from '@bitlerjs/llm';

import { profile } from './capabilities/profile.js';
import { agent } from './agents/agent.js';
import { userContext } from './contexts/user.js';
import { myIssues } from './capabilities/my-issues.js';
import { getIssue } from './capabilities/get-issue.js';
import { issuesContext } from './contexts/issues.js';
import { linearConfig } from './configs/configs.js';
import { LinearService } from './servies/services.linear.js';

const linear = createExtension({
  setup: async ({ container }) => {
    const configsService = container.get(Configs);
    const agentsService = container.get(Agents);
    const contextItemsService = container.get(ContextItems);
    const capabilitiesService = container.get(Capabilities);

    configsService.register([linearConfig]);

    configsService.use(linearConfig, async (config) => {
      if (!config || !config.enabled) {
        container.remove(LinearService);
        agentsService.unregister([agent.kind]);
        contextItemsService.unregister([userContext.kind, issuesContext.kind]);
        capabilitiesService.unregister([profile.kind, myIssues.kind, getIssue.kind]);
      } else {
        agentsService.register([agent]);
        contextItemsService.register([userContext, issuesContext]);
        capabilitiesService.register([profile, myIssues, getIssue]);
      }
    });
  },
});

export { linear };
