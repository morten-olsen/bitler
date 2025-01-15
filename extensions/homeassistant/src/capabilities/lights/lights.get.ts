import { createCapability, z } from '@bitlerjs/core';

import { HomeassistantService } from '../../services/services.ha.js';
import { HomeAssistantContext, roomsContextSetup } from '../../context/rooms.js';

const orNull = <T extends z.ZodType<any>>(type: T) => z.union([type, z.null()]);
const lightSchema = z.object({
  brightness: orNull(z.number()).optional().describe('The brightness of the light between 0 and 255'),
  color_temp_kelvin: orNull(z.number()).optional(),
  rgb_color: orNull(z.array(z.number())).optional(),
  friendly_name: z.string(),
  lights: orNull(z.array(z.string())).optional(),
  entity_id: orNull(z.array(z.string())).optional(),
  icon: orNull(z.string()).optional(),
});

const get = createCapability({
  kind: `homeassistant.lights.get`,
  name: 'Get light status',
  group: 'Home',
  description: 'Get the status of the lights in a room',
  setup: [roomsContextSetup],
  input: z.object({
    rooms: z.array(z.string()).describe('The room ids to turn off the lights in (allows multiple rooms)'),
    transition: z.number().describe('The duration in seconds to transition to the new state').optional(),
  }),
  output: z.object({
    rooms: z.array(
      z.object({
        id: z.string(),
        all: lightSchema,
      }),
    ),
  }),
  handler: async ({ input, container, context }) => {
    const { getRooms } = container.get(HomeAssistantContext);
    const ha = container.get(HomeassistantService);
    await ha.ready();

    const roomsInfo = getRooms(input.rooms || [], context);

    const rooms = roomsInfo.flatMap((roomInfo) => {
      if (!roomInfo) {
        return [];
      }

      const allEntity = roomInfo.lightGroup ? ha.entities[roomInfo.lightGroup] : undefined;
      const room = {
        id: roomInfo.id,
        all: allEntity?.attributes as any,
      };
      return [room];
    });

    return {
      rooms,
    };
  },
});

export { get };
