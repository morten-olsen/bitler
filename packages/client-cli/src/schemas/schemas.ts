import { Type } from '@sinclair/typebox';
import { compile } from 'json-schema-to-typescript';

type SchemaResponse = {
  capabilities: {
    [key: string]: {
      kind: string;
      name: string;
      group: string;
      description: string;
      input: any;
      output: any;
    }
  };
  actionRequests: {
    [key: string]: {
      kind: string;
      name: string;
      description: string;
      schema: any;
    }
  };
  contextItems: {
    [key: string]: {
      kind: string;
      name: string;
      description: string;
      schema: any;
    }
  };
  agents: {
    [key: string]: {
      kind: string;
      name: string;
      description?: string;
      capabilities: string[];
      agents: string[];
    };
  };
  events: {
    [key: string]: {
      kind: string;
      name: string;
      description: string;
      input: any;
      output: any;
    }
  };
}

const getSchemas = async (baseUrl: string) => {
  const response = await fetch(`${baseUrl}/api/schemas`);
  const schemas = await response.json();
  return schemas as SchemaResponse;;
}

const buildSchema = async (baseUrl: string) => {
  const schemas = await getSchemas(baseUrl);
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
      )
    ),
    actionRequests: Type.Object(
      Object.fromEntries(
        Object.entries(schemas.actionRequests).map(([key, value]) => [
          key,
          Type.Object({
            schema: Type.Unsafe(value.schema),
          }),
        ]),
      )
    ),
    contextItems: Type.Object(
      Object.fromEntries(
        Object.entries(schemas.contextItems).map(([key, value]) => [
          key,
          Type.Object({
            schema: Type.Unsafe(value.schema),
          }),
        ]),
      )
    ),
    agents: Type.Union([
      ...Object.keys(schemas.agents).map((key) => Type.Literal(key)),
      Type.String(),
    ]),
    events: Type.Object(
      Object.fromEntries(
        Object.entries(schemas.events).map(([key, value]) => [
          key,
          Type.Object({
            input: Type.Unsafe(value.input),
            output: Type.Unsafe(value.output),
          }),
        ]),
      )
    ),
  });
  return schema;
}

const buildTypes = async (baseUrl: string) => {
  const schemas = await buildSchema(baseUrl);
  const comiled = await compile(
    schemas,
    'BitlerServer',
    {
      additionalProperties: false,
    }
  );

  return comiled;
}

export { buildSchema, buildTypes }

