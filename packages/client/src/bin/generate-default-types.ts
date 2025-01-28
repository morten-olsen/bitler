import { mkdir, writeFile } from 'fs/promises';
import { dirname, resolve } from 'path';

import { createSchemas, capabilities as coreCapabilities, events as coreEvents } from '@bitlerjs/core';
import { capabilities as notificationsCapabilites, events as notificationsEvents } from '@bitlerjs/notifications';
import { capabilities as llmCapabilites, events as llmEvents, contexts as llmContexts } from '@bitlerjs/llm';
import { capabilities as conversationsCapabilities, events as conversationsEvents } from '@bitlerjs/conversations';

import { buildTypesFromSchema } from './schemas/schemas.js';

const schema = createSchemas({
  capabilities: [
    ...Object.values(coreCapabilities),
    ...Object.values(notificationsCapabilites),
    ...Object.values(llmCapabilites),
    ...Object.values(conversationsCapabilities),
  ],
  events: [
    ...Object.values(coreEvents),
    ...Object.values(notificationsEvents),
    ...Object.values(llmEvents),
    ...Object.values(conversationsEvents),
  ],
  contextItems: [...Object.values(llmContexts)],
});
const location = resolve(import.meta.dirname, '../generated/types.ts');
const types = await buildTypesFromSchema(schema);
const dir = dirname(location);
await mkdir(dir, { recursive: true });
await writeFile(location, types);
