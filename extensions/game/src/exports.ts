import { Capabilities, ContextItems, createExtension } from '@bitlerjs/core';

import { setState } from './capabilities/set-state.js';
import { gameStateContext } from './contexts/game-state.js';
import { rollDice } from './capabilities/roll-dice.js';

const game = createExtension({
  setup: async ({ container }) => {
    const contextItemsService = container.get(ContextItems);
    contextItemsService.register([gameStateContext]);

    const capabilitiesService = container.get(Capabilities);
    capabilitiesService.register([setState, rollDice]);
  },
});

export { game };
