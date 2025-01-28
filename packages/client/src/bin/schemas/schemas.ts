import { Type } from '@sinclair/typebox';
import { compile } from 'json-schema-to-typescript';

type SchemaResponse = {
  capabilities: Record<
    string,
    {
      kind: string;
      name: string;
      group: string;
      description: string;
      input: any;
      output: any;
    }
  >;
  actionRequests: Record<
    string,
    {
      kind: string;
      name: string;
      description: string;
      schema: any;
    }
  >;
  contextItems: Record<
    string,
    {
      kind: string;
      name: string;
      description: string;
      schema: any;
    }
  >;
  events: Record<
    string,
    {
      kind: string;
      name: string;
      description: string;
      input: any;
      output: any;
    }
  >;
};

const getSchemas = async (baseUrl: string) => {
  const response = await fetch(`${baseUrl}/api/schemas`);
  const schemas = await response.json();
  if (!response.ok) {
    throw new Error(schemas.message);
  }
  return schemas as SchemaResponse;
};

const buildSchema = async (schemas: Awaited<ReturnType<typeof getSchemas>>) => {
  const schema = Type.Object({
    capabilities: Type.Object(
      Object.fromEntries(
        Object.entries(schemas.capabilities).map(([key, value]) => [
          key,
          Type.Object({
            input: Type.Unsafe(value.input),
            output: Type.Unsafe(value.output),
          }),
        ]),
      ),
    ),
    actionRequests: Type.Object(
      Object.fromEntries(
        Object.entries(schemas.actionRequests).map(([key, value]) => [
          key,
          Type.Object({
            schema: Type.Unsafe(value.schema),
          }),
        ]),
      ),
    ),
    contextItems: Type.Object(
      Object.fromEntries(
        Object.entries(schemas.contextItems).map(([key, value]) => [
          key,
          Type.Object({
            schema: Type.Unsafe(value.schema),
          }),
        ]),
      ),
    ),
    events: Type.Object(
      Object.fromEntries(
        Object.entries(schemas.events).map(([key, value]) => [
          key,
          Type.Object({
            input: Type.Unsafe(value.input),
            output: Type.Unsafe(value.output),
          }),
        ]),
      ),
    ),
  });
  return schema;
};

const buildTypesFromUrl = async (baseUrl: string) => {
  const serverSchemas = await getSchemas(baseUrl);
  const schemas = await buildSchema(serverSchemas);
  const comiled = await compile(schemas, 'BitlerServer', {
    additionalProperties: false,
  });

  return comiled;
};

const buildTypesFromSchema = async (serverSchemas: Awaited<ReturnType<typeof getSchemas>>) => {
  const schemas = await buildSchema(serverSchemas);
  const comiled = await compile(schemas, 'BitlerServer', {
    additionalProperties: false,
  });

  return comiled;
};

export { buildTypesFromSchema, buildTypesFromUrl };
