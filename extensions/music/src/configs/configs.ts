import { createConfigItem, z } from '@bitlerjs/core';

const spotifyConfig = createConfigItem({
  kind: 'music.spotify',
  name: 'Spotify',
  group: 'Integrations',
  description: 'Spotify music configuration',
  schema: z.object({
    enabled: z.boolean(),
    clientId: z.string().optional(),
    clientSecret: z.string().optional(),
  }),
});

export { spotifyConfig };
