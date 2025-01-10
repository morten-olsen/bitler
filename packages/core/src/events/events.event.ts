import { z, ZodSchema } from "zod";
import { Container } from "../exports.js";

type EventHandlerOptions<TInput extends ZodSchema> = {
  container: Container;
  input: z.infer<TInput>;
};

type Event<
  TInput extends ZodSchema,
  TOutput extends ZodSchema
> = {
  kind: string;
  name: string;
  group: string;
  description: string;
  input: TInput;
  output: TOutput;
  filter?: (options: EventHandlerOptions<TInput>) => Promise<boolean>;
}

const createEvent = <TInput extends ZodSchema, TOutput extends ZodSchema>(
  event: Event<TInput, TOutput>
): Event<TInput, TOutput> => event;

export { type Event, createEvent };
