import { createCapability, z } from '@bitlerjs/core';

import { SpotifyService } from '../services/services.spotify.js';

const search = createCapability({
  kind: 'spotify.search',
  name: 'Search',
  group: 'Spotify',
  description: 'Search for music on Spotify',
  input: z.object({
    query: z.string(),
    types: z.object({
      album: z.boolean(),
      artist: z.boolean(),
      playlist: z.boolean(),
      track: z.boolean(),
    }),
  }),
  output: z.unknown(),
  handler: async ({ input, container }) => {
    const api = container.get(SpotifyService).get();
    const types = Object.keys(input.types).filter((type) => input.types[type as keyof typeof input.types]);
    const result = await api.search(input.query, types as any);
    return result;
  },
});

export { search };
