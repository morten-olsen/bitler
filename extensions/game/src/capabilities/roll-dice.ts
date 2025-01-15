import { createCapability, z } from '@bitler/core';

const rollDice = createCapability({
  kind: 'game.roll-dice',
  name: 'Roll Dice',
  group: 'Game',
  description: 'Roll the dice, returning a random number between 0 and the selcted number of sides',
  input: z.object({
    sides: z.number().describe('The number of sides on the dice.'),
  }),
  output: z.number().describe('The number rolled on the dice.'),
  handler: async ({ input }) => {
    return Math.floor(Math.random() * input.sides);
  },
});

export { rollDice };
