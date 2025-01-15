import { createCapability, z } from '@bitler/core';

import { roomsContext, roomsContextSetup } from '../../context/rooms.js';

const get = createCapability({
  kind: `homeassistant.setup.get-config`,
  name: 'Get config',
  group: 'Home',
  description: 'Get the configuration for the home assistant integration',
  setup: [roomsContextSetup],
  input: z.object({}),
  output: z.object({
    rooms: roomsContext.schema,
  }),
  handler: async ({ context }) => {
    return {
      rooms: context.get(roomsContext) || [],
    };
  },
});

export { get };
