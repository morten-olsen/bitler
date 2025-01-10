import { createExtension } from "@bitler/core";
import { profile } from "./capabilities/profile.js";
import { agent } from "./agents/agent.js";
import { userContext } from "./contexts/user.js";
import { myIssues } from "./capabilities/my-issues.js";
import { getIssue } from "./capabilities/get-issue.js";
import { issuesContext } from "./contexts/issues.js";

const linear = createExtension({
  contexts: [
    userContext,
    issuesContext,
  ],
  agents: [
    agent,
  ],
  capabilities: [
    profile,
    myIssues,
    getIssue,
  ]
})

export { linear };
