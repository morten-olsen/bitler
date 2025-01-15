import { createCapability, z } from '@bitlerjs/core';
import { HomeAssistantContext, HomeassistantService, roomsContextSetup } from '@bitlerjs/homeassistant';

const pause = createCapability({
  kind: 'music.pause',
  name: 'Pause',
  group: 'Music',
  description: 'Pause music',
  setup: [roomsContextSetup],
  input: z.object({
    room: z.string().describe('Room ID'),
  }),
  output: z.object({
    success: z.boolean(),
  }),
  handler: async ({ input, container, context }) => {
    const haService = container.get(HomeassistantService);
    const haContext = container.get(HomeAssistantContext);
    const [room] = haContext.getRooms([input.room], context);
    if (!room) {
      throw new Error(`Room not found: ${input.room}`);
    }
    const player = room.mediaPlayers;
    if (!player) {
      throw new Error(`Room does not have a media player: ${input.room}`);
    }
    await haService.callService({
      domain: 'media_player',
      service: 'media_pause',
      target: {
        entities: [player],
      },
    });
    return {
      success: true,
    };
  },
});

export { pause };
