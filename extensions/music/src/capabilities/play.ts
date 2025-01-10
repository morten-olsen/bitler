import { createCapability, z } from "@bitler/core";
import { HomeAssistantContext, HomeassistantService, roomsContext, roomsContextSetup } from "@bitler/homeassistant";

const play = createCapability({
  kind: 'music.play',
  name: 'Play',
  group: 'Music',
  description: 'Play music',
  setup: [
    roomsContextSetup,
  ],
  input: z.object({
    spotifyUris: z.array(z.string()),
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
    haService.callService({
      domain: 'music_assistant',
      service: 'play_media',
      serviceData: {
        entity_id: player,
        media_id: input.spotifyUris,
      }
    })
    return {
      success: true,
    }
  },
});

export { play };
