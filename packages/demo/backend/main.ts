import 'dotenv/config';
import { Configuration } from '@bitler/core';
import { homeassistant } from '@bitler/homeassistant';
import { timers } from '@bitler/timers';
import { music } from '@bitler/music';
import { linear } from '@bitler/linear';
import { game } from '@bitler/game';
import { signal } from '@bitler/signal';
import { jsonDocuments } from '@bitler/json-documents';
import { llm } from '@bitler/llm';

const config: Configuration = {
  extensions: [
    llm,
    timers,
    game,
    jsonDocuments,
    homeassistant,
    music,
    linear,
    signal,
  ]
};

export { config };
