import { ZodSchema, z } from 'zod';

import { Container } from '../exports.js';

type EventHandlerOptions<TInput extends ZodSchema, TOutput extends ZodSchema> = {
  container: Container;
  input: z.infer<TInput>;
  event: z.infer<TOutput>;
};

type EventHandlerSetupOptions<TInput extends ZodSchema, TOutput extends ZodSchema> = {
  container: Container;
  input: z.infer<TInput>;
  listener: (event: z.infer<TOutput>) => Promise<void>;
};

type Event<TInput extends ZodSchema, TOutput extends ZodSchema> = {
  kind: string;
  name: string;
  group: string;
  description: string;
  input: TInput;
  output: TOutput;
  filter?: (options: EventHandlerOptions<TInput, TOutput>) => Promise<boolean>;
  setup?: (options: EventHandlerSetupOptions<TInput, TOutput>) => Promise<void>;
};

const createEvent = <TInput extends ZodSchema, TOutput extends ZodSchema>(
  event: Event<TInput, TOutput>,
): Event<TInput, TOutput> => event;

export { type Event, createEvent };
