import { createCapability, z } from '@bitlerjs/core';

import { AuthService } from './auth.service.js';

const createToken = createCapability({
  kind: 'docker.auth.createToken',
  name: 'Create Token',
  group: 'Auth',
  description: 'Create a new token for authentication',
  input: z.object({}),
  output: z.object({ token: z.string() }),
  handler: async ({ container }) => {
    const authService = container.get(AuthService);
    const token = await authService.generateToken({});
    return { token };
  },
});

export { createToken };
