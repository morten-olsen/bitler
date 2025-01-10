import { createContextItem, z } from "@bitler/core";
import { issueSchema } from "../schemas/schemas.js";

const issuesContext = createContextItem({
  kind: 'linear.issues',
  name: 'Current linear issues',
  description: 'Issues the user is currently looking at',
  schema: z.array(issueSchema),
  persistByDefault: true,
});

export { issuesContext };
