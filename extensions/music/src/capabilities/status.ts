import { createCapability, z } from '@bitler/core';
import { HomeassistantService, roomsContext, roomsContextSetup } from '@bitler/homeassistant';

const status = createCapability({
  kind: 'music.status',
  name: 'Status',
  group: 'Music',
  description: 'Get music status',
  setup: [roomsContextSetup],
  input: z.object({}),
  output: z.object({
    rooms: z.array(
      z.object({
        id: z.string(),
        player: z.object({
          id: z.string(),
          state: z.string(),
          volume_level: z.number().optional(),
          media_content_id: z.string().optional(),
          media_content_type: z.string().optional(),
          media_duration: z.number().optional(),
          media_title: z.string().optional(),
          media_artist: z.string().optional(),
          media_album_name: z.string().optional(),
          app_id: z.string().optional(),
          shuffle: z.boolean().optional(),
          repeat: z.string().optional(),
          entity_picture: z.string().optional(),
        }),
      }),
    ),
  }),
  handler: async ({ container, context }) => {
    const haService = container.get(HomeassistantService);
    await haService.ready();
    const roomsInfo = context.get(roomsContext);

    const rooms =
      roomsInfo?.flatMap((room) => {
        if (!room.mediaPlayers) {
          return [];
        }
        const entity = haService.entities[room.mediaPlayers];
        if (!entity) {
          return [];
        }
        return {
          id: room.id,
          player: {
            id: entity.entity_id,
            state: entity.state,
            ...entity.attributes,
          },
        };
      }) || [];
    return {
      rooms,
    };
  },
});

export { status };
