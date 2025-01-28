import { z } from 'zod';
import micromatch from 'micromatch';

import { createSessionItem } from '../exports.js';

const permissionsSchema = z.object({
  type: z.enum(['allow', 'deny']),
  actions: z.array(z.string()),
  resources: z.array(z.string()),
});

type Permission = z.infer<typeof permissionsSchema>;

const policySchema = z.array(permissionsSchema);

type Policy = z.infer<typeof policySchema>;

type HasPermissionsOptions = {
  actions: string[];
  resources: string[];
};

const hasPermission = (options: HasPermissionsOptions, policy: Policy): boolean => {
  const isDenied = policy.some((permission) => {
    if (permission.type === 'allow') {
      return false;
    }
    const actionsMatch = micromatch(options.actions, permission.actions);
    const resourcesMatch = micromatch(options.resources, permission.resources);
    return actionsMatch.length > 0 && resourcesMatch.length > 0;
  });
  const isAllowed = policy.some((permission) => {
    if (permission.type === 'deny') {
      return false;
    }
    const actionsMatch = micromatch(options.actions, permission.actions);
    const resourcesMatch = micromatch(options.resources, permission.resources);
    return actionsMatch.length > 0 && resourcesMatch.length > 0;
  });

  return isAllowed && !isDenied;
};

const sessionPolicy = createSessionItem({
  kind: 'policy',
  schema: policySchema,
});

export { permissionsSchema, type Permission, policySchema, type Policy, hasPermission, sessionPolicy };
