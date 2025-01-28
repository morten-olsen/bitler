import { ZodSchema, z } from 'zod';

import { Container } from '../container/container.js';
import { ContextSetup } from '../contexts/contexts.setup.js';
import { Context } from '../contexts/contexts.context.js';
import { ActionRequestInstance } from '../action-requests/action-requests.instance.js';
import { Session } from '../session/session.js';
import { ConfigItem } from '../configs/configs.js';

type CapabilityHandlerOptions<TInput extends ZodSchema> = {
  input: z.infer<TInput>;
  container: Container;
  context: Context;
  session: Session;
  actionRequests: ActionRequestInstance;
};

type CapabilityHandler<TInput extends ZodSchema, TOutput extends ZodSchema> = (
  options: CapabilityHandlerOptions<TInput>,
) => Promise<z.infer<TOutput>>;

type Capability<TInput extends ZodSchema = any, TOutput extends ZodSchema = any> = {
  kind: string;
  name: string;
  group: string;
  configs?: ConfigItem[];
  description: string;
  agentDescription?: string;
  setup?: ContextSetup[];
  disableDiscovery?: boolean;
  input: TInput;
  output: TOutput;
  handler: CapabilityHandler<TInput, TOutput>;
};

const createCapability = <TInput extends ZodSchema, TOutput extends ZodSchema>(
  capability: Capability<TInput, TOutput>,
) => capability;

export { type CapabilityHandlerOptions, type CapabilityHandler, type Capability, createCapability };
