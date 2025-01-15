import { Context, Databases, createContextItem, createContextSetup, z } from '@bitlerjs/core';

import { databaseConfig } from '../database/database.js';

const roomsContext = createContextItem({
  kind: `homeassistant.rooms`,
  name: 'Rooms',
  description: 'A list of rooms in the house',
  schema: z.array(
    z.object({
      id: z.string(),
      names: z.array(z.string()),
      mediaPlayers: z.union([z.string(), z.null()]).optional(),
      lightGroup: z.union([z.string(), z.null()]).optional(),
      lights: z
        .array(
          z.object({
            id: z.string(),
            name: z.string(),
          }),
        )
        .optional(),
    }),
  ),
});

const roomsContextSetup = createContextSetup({
  handler: async ({ container, context }) => {
    const dbs = container.get(Databases);
    const db = await dbs.get(databaseConfig);
    const roomRows = await db.select('*').from('rooms');
    const roomNameRows = await db.select('*').from('room_names');

    const rooms = roomRows.map((room: any) => {
      const names = roomNameRows.filter((name: any) => name.room_id === room.id).map((name) => name.name);
      return {
        id: room.id,
        mediaPlayers: room.mediaPlayers,
        names,
        lightGroup: room.lightGroup,
      };
    });
    context.set(roomsContext, rooms);
  },
});

class HomeAssistantContext {
  public getRooms = (ids: string[], context: Context) => {
    const rooms = context.get(roomsContext);
    if (!rooms) {
      return [];
    }
    const room = ids.map((id) => rooms.find((room) => room.id === id));
    return room;
  };
}

export { HomeAssistantContext };

export { roomsContext, roomsContextSetup };
