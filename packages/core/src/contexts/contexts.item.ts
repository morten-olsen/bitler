import { ZodAny, ZodSchema } from 'zod';

type ContextItem<TSchema extends ZodSchema = any> = {
  kind: string;
  name: string;
  description: string;
  persistByDefault?: boolean;
  schema: TSchema;
};

const createContextItem = <TSchema extends ZodSchema>(item: ContextItem<TSchema>) => item;

export { createContextItem, type ContextItem };
