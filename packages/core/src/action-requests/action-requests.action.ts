import { ZodSchema } from "zod";

type ActionRequest<TSchema extends ZodSchema> = {
  kind: string;
  name: string;
  description: string;
  schema: TSchema;
};

const createActionRequest = <TSchema extends ZodSchema>(action: ActionRequest<TSchema>) => action;

export { type ActionRequest, createActionRequest };
