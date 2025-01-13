import { createAgent } from '@bitler/llm';
import { myIssues } from "../capabilities/my-issues.js";
import { getIssue } from "../capabilities/get-issue.js";

const agent = createAgent({
  kind: 'linear',
  name: 'Linear',
  description: 'Linear is a modern issue tracking tool',
  capabilities: [
    myIssues.kind,
    getIssue.kind,
  ],
});

export { agent };
