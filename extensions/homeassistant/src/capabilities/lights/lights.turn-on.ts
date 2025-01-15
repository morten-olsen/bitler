import { createCapability, z } from '@bitler/core';

import { HomeassistantService } from '../../services/services.ha.js';
import { HomeAssistantContext, roomsContextSetup } from '../../context/rooms.js';

const turnOn = createCapability({
  kind: `homeassistant.lights.turn-on`,
  name: 'Turn on lights',
  group: 'Home',
  description: 'Turn on the lights',
  setup: [roomsContextSetup],
  input: z.object({
    rooms: z.array(z.string()).describe('The room ids to turn on the lights in (allows multiple rooms)'),
    brightness: z
      .number()
      .describe(
        'Number indicating the percentage of full brightness, where 0 turns the light off, 1 is the minimum brightness, and 100 is the maximum brightness.',
      )
      .optional(),
    brightnessStep: z.number().describe('Change brightness by a percentage.').optional(),
    temperature: z.number().describe('light temperature in kelvin').optional(),
    color: z
      .object({
        r: z.number(),
        g: z.number(),
        b: z.number(),
      })
      .describe(
        'The color in RGB format. A list of three integers between 0 and 255 representing the values of red, green, and blue',
      )
      .optional(),
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
      service: 'turn_on',
      serviceData: {
        entity_id: roomIds,
        brightness_pct: input.brightness,
        brightness_step_pct: input.brightnessStep,
        rgb_color: input.color ? [input.color.r, input.color.g, input.color.b] : undefined,
        kelvin: input.temperature,
      },
    });
    return {
      success: true,
    };
  },
});

export { turnOn };
