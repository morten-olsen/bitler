import { createCapability, z } from "@bitler/core";
import { HomeAssistantContext, HomeassistantService, roomsContextSetup } from "@bitler/homeassistant";

const setVolume = createCapability({
  kind: 'music.set-volume',
  name: 'Set volume',
  group: 'Music',
  description: 'Set music volume',
  setup: [
    roomsContextSetup,
  ],
  input: z.object({
    volume: z.number().describe('Volume level (0-1)'),
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
      service: 'volume_set',
      serviceData: {
        volume_level: input.volume,
      },
      target: {
        entities: [player],
      }
    })
    return {
      success: true,
    }
  },
});

export { setVolume };
