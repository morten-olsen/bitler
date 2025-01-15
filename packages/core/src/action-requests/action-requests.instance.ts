import { ZodSchema, z } from 'zod';

import { ActionRequest } from './action-requests.action.js';

class ActionRequestInstance {
  #requests: {
    request: ActionRequest<any>;
    description?: string;
    value: unknown;
  }[] = [];

  public request<T extends ZodSchema>(request: ActionRequest<T>, input: z.infer<T>, description?: string) {
    this.#requests.push({ request, value: input, description });
  }

  public toJSON() {
    return this.#requests.map(({ request, value, description }) => {
      return {
        kind: request.kind,
        description,
        value,
      };
    });
  }
}

export { ActionRequestInstance };
