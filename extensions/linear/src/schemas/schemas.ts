import { z } from '@bitler/core';

const date = z.union([z.string(), z.date()]);
const issueSchema = z.object({
  id: z.string(),
  identifier: z.string(),
  priority: z.number().optional(),
  priorityLabel: z.string().optional(),
  title: z.string(),
  addedToCycleAt: date.optional(),
  branchName: z.string().optional(),
  createdAt: date,
  completedAt: date.optional(),
  cancelledAt: date.optional(),
  estimate: z.number().optional(),
  labelIds: z.array(z.string()),
  snoozedUntil: date.optional(),
  startedAt: date.optional(),
  updatedAt: date,
  description: z.string().optional(),
});

type Issue = z.infer<typeof issueSchema>;

export { issueSchema, type Issue };
