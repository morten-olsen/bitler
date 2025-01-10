import { ZodSchema } from "zod";

type SessionItem<TSchema extends ZodSchema> = {
  kind: string;
  schema: TSchema;
}

const createSessionItem = <TSchema extends ZodSchema>(sessionItem: SessionItem<TSchema>) => sessionItem;

export { type SessionItem, createSessionItem };
