import { createAgent } from "@bitler/core";
import { setState } from "../capabilities/set-state.js";
import { rollDice } from "../capabilities/roll-dice.js";

const defaultAgent = createAgent({
  kind: 'game.default',
  name: 'Game',
  description: 'The default game agent.',
  systemPrompt: [
    'You are the game master of a game the user will explain to you.',
    'Your task is to interact with the user and tell them what happens in the game.',
    'You can use the set state capability to keep track of the game state.',
    'Ensure the user has a good time and that the game is fun and engaging.',
    'Remember to inform the user about the state of the game when relevant.',
  ].join('\n'),
  capabilities: [
    setState.kind,
    rollDice.kind,
  ],
})

export { defaultAgent };
