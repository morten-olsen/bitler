import { ZodSchema } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const getJsonSchema = (schema: ZodSchema) => {
  const { definitions } = zodToJsonSchema(schema, {
    name: 'request',
    $refStrategy: 'none',
  });
  if (!definitions) {
    throw new Error('No definitions found');
  }
  return definitions.request;
};

export { getJsonSchema };
