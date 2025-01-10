import { createExtension } from "@bitler/core";
import { defaultAgent } from "./agents/default.js";
import { setState } from "./capabilities/set-state.js";
import { gameStateContext } from "./contexts/game-state.js";
import { rollDice } from "./capabilities/roll-dice.js";

const game = createExtension({
  agents: [
    defaultAgent,
  ],
  contexts: [
    gameStateContext,
  ],
  capabilities: [
    setState,
    rollDice,
  ],
});

export { game };
