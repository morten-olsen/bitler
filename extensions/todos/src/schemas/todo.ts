import { z } from '@bitlerjs/core';

const todoCreateSchema = z.object({
  parentId: z.string().nullable().optional(),
  contextId: z.string().nullable().optional(),
  projectId: z.string().nullable().optional(),
  ownerId: z.string().nullable().optional(),
  assigneeId: z.string().nullable().optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
  completedAt: z.date().nullable().optional(),
  dueDate: z.date().nullable().optional(),
  dueTime: z.date().nullable().optional(),
  startDate: z.date().nullable().optional(),
  startTime: z.date().nullable().optional(),
  tags: z.array(z.string()).optional(),
});

const todoEditSchema = z.object({
  ...todoCreateSchema.shape,
  id: z.string(),
});

const todoSchema = z.object({
  ...todoCreateSchema.shape,
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export { todoSchema, todoEditSchema, todoCreateSchema };
