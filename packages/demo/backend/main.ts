import 'dotenv/config';
import { type Configuration } from '@bitlerjs/core';
import { homeassistant } from '@bitlerjs/homeassistant';
import { timers } from '@bitlerjs/timers';
import { music } from '@bitlerjs/music';
import { linear } from '@bitlerjs/linear';
import { game } from '@bitlerjs/game';
import { signal } from '@bitlerjs/signal';
import { jsonDocuments } from '@bitlerjs/json-documents';
import { llm } from '@bitlerjs/llm';
import { knowledgeBases } from '@bitlerjs/knowledge-bases';
import { notifications } from '@bitlerjs/notifications';
import { http } from '@bitlerjs/http';

const config: Configuration = {
  extensions: [
    llm,
    notifications,
    knowledgeBases,
    timers,
    game,
    jsonDocuments,
    homeassistant,
    music,
    linear,
    signal,
    http,
  ],
};

export { config };
