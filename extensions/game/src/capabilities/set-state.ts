import { createCapability, z } from "@bitler/core";
import { gameStateContext } from "../contexts/game-state.js";

const setState = createCapability({
  kind: 'game.set-state',
  name: 'Set State',
  group: 'Game',
  description: 'Set the state of the game.',
  agentDescription: [
    'Set the state of the game.',
    'Use this to create of modify the state of the game.',
    'For instance if it make sense for the user to have a specific amount of money, you can set that here.',
    'If the user then performs an action that changes the amount of money, you can update the state here.',
    'Example: { "money": 100, "health": 100 }',
    'Then, when the user buys something, you can update the state to { "money": 90, "health": 100 }',
    'Remember to include the exisiting state when updating the state, otherwise you will overwrite the state.',
    ''
  ].join('\n'),
  input: z.object({
    json: z.string().describe('The JSON representation of the game state as a string.'),
  }),
  output: z.record(z.unknown()),
  handler: async ({ context, input }) => {
    const state = JSON.parse(input.json);
    context.set(gameStateContext, state);
    return state;
  },
});

export { setState };
