import { z } from 'zod';

import { Capability } from '../capabilities/capabilities.js';
import { ActionRequest } from '../action-requests/action-requests.js';
import { ContextItem } from '../contexts/contexts.js';
import { Event } from '../events/events.js';

import { getJsonSchema } from './zod.js';

const schemasSchema = z.object({
  capabilities: z.record(
    z.object({
      kind: z.string(),
      group: z.string(),
      name: z.string(),
      description: z.string(),
      input: z.any(),
      output: z.any(),
    }),
  ),
  actionRequests: z.record(
    z.object({
      kind: z.string(),
      name: z.string(),
      description: z.string(),
      schema: z.any(),
    }),
  ),
  contextItems: z.record(
    z.object({
      kind: z.string(),
      name: z.string(),
      description: z.string(),
      schema: z.any(),
    }),
  ),
  events: z.record(
    z.object({
      kind: z.string(),
      name: z.string(),
      description: z.string(),
      input: z.any(),
      output: z.any(),
    }),
  ),
});

type CreateSchemaOptions = {
  capabilities?: Capability[];
  actionRequests?: ActionRequest[];
  contextItems?: ContextItem[];
  events?: Event[];
};

const createSchemas = ({
  capabilities = [],
  actionRequests = [],
  contextItems = [],
  events = [],
}: CreateSchemaOptions) => {
  const result = {
    capabilities: Object.fromEntries(
      capabilities.map((capability) => [
        capability.kind,
        {
          kind: capability.kind,
          group: capability.group,
          name: capability.name,
          description: capability.description,
          input: getJsonSchema(capability.input),
          output: getJsonSchema(capability.output),
        },
      ]),
    ),
    actionRequests: Object.fromEntries(
      actionRequests.map((actionRequest) => [
        actionRequest.kind,
        {
          kind: actionRequest.kind,
          name: actionRequest.name,
          description: actionRequest.description,
          schema: getJsonSchema(actionRequest.schema),
        },
      ]),
    ),
    contextItems: Object.fromEntries(
      contextItems.map((contextItem) => [
        contextItem.kind,
        {
          kind: contextItem.kind,
          name: contextItem.name,
          description: contextItem.description,
          schema: getJsonSchema(contextItem.schema),
        },
      ]),
    ),
    events: Object.fromEntries(
      events.map((event) => [
        event.kind,
        {
          kind: event.kind,
          name: event.name,
          description: event.description,
          input: getJsonSchema(event.input),
          output: getJsonSchema(event.output),
        },
      ]),
    ),
  };

  return result;
};

export { createSchemas, schemasSchema };
