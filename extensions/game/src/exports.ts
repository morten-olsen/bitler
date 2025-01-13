import { createExtension } from "@bitler/core";
import { setState } from "./capabilities/set-state.js";
import { gameStateContext } from "./contexts/game-state.js";
import { rollDice } from "./capabilities/roll-dice.js";

const game = createExtension({
  contexts: [
    gameStateContext,
  ],
  capabilities: [
    setState,
    rollDice,
  ],
});

export { game };
