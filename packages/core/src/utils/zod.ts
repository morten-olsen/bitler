import { ZodSchema } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const getJsonSchema = (schema: ZodSchema) => {
  return zodToJsonSchema(schema, {
    name: 'request',
    $refStrategy: 'none',
  }).definitions!.request;
};

export { getJsonSchema };
