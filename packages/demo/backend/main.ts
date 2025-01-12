import 'dotenv/config';
import { builtin, Configuration } from '@bitler/core';
import { homeassistant } from '@bitler/homeassistant';
import { timers } from '@bitler/timers';
import { music } from '@bitler/music';
import { agents } from '@bitler/agents';
import { linear } from '@bitler/linear';
import { game } from '@bitler/game';
import { signal } from '@bitler/signal';
import { jsonDocuments } from '@bitler/json-documents';

const config: Configuration = {
  extensions: [
    builtin,
    agents,
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
