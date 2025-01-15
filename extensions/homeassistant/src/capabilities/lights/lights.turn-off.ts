import { createCapability, z } from '@bitlerjs/core';

import { HomeassistantService } from '../../services/services.ha.js';
import { HomeAssistantContext, roomsContextSetup } from '../../context/rooms.js';

const turnOff = createCapability({
  kind: `homeassistant.lights.turn-off`,
  name: 'Turn off lights',
  group: 'Home',
  description: 'Turn off the lights',
  setup: [roomsContextSetup],
  input: z.object({
    rooms: z.array(z.string()).describe('The room ids to turn off the lights in (allows multiple rooms)'),
    transition: z.number().describe('The duration in seconds to transition to the new state').optional(),
  }),
  output: z.object({
    success: z.boolean(),
  }),
  handler: async ({ input, container, context }) => {
    const { getRooms } = container.get(HomeAssistantContext);

    const roomIds = getRooms(input.rooms || [], context).flatMap((room) => {
      if (!room || !room.lightGroup) {
        return [];
      }
      return [room.lightGroup];
    });
    if (roomIds.length === 0) {
      throw new Error('No lights found in the rooms');
    }
    const ha = container.get(HomeassistantService);
    await ha.callService({
      domain: 'light',
      service: 'turn_off',
      serviceData: {
        entity_id: roomIds,
        transition: input.transition,
      },
    });
    return {
      success: true,
    };
  },
});

export { turnOff };
