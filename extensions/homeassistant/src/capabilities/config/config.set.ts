import { Databases, createCapability, z } from '@bitler/core';

import { roomsContext, roomsContextSetup } from '../../context/rooms.js';
import { databaseConfig } from '../../database/database.js';

const set = createCapability({
  kind: `homeassistant.setup.set-config`,
  name: 'Set config',
  group: 'Home',
  description: 'Set the configuration for the home assistant integration',
  setup: [roomsContextSetup],
  input: z.object({
    rooms: roomsContext.schema,
  }),
  output: z.object({
    success: z.boolean(),
  }),
  handler: async ({ input, container }) => {
    const dbs = container.get(Databases);
    const db = await dbs.get(databaseConfig);

    await db('room_names').delete();
    await db('rooms').delete();

    await db.transaction(async (trx) => {
      await trx('rooms').insert(
        input.rooms.map((room) => ({
          id: room.id,
          mediaPlayers: room.mediaPlayers,
          lightGroup: room.lightGroup,
        })),
      );

      const roomNames = input.rooms.flatMap((room) =>
        room.names.map((name) => ({
          room_id: room.id,
          name,
        })),
      );

      await trx('room_names').insert(roomNames);
    });

    return {
      success: true,
    };
  },
});

export { set };
