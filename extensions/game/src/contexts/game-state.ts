import { createContextItem, z } from "@bitler/core";

const gameStateContext = createContextItem({
  kind: 'game.state',
  name: 'Game State',
  description: 'The current state of the game.',
  schema: z.record(z.unknown()),
});

export { gameStateContext };
