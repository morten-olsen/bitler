import 'dotenv/config';
import { type Configuration } from '@bitler/core';
import { homeassistant } from '@bitler/homeassistant';
import { timers } from '@bitler/timers';
import { music } from '@bitler/music';
import { linear } from '@bitler/linear';
import { game } from '@bitler/game';
import { signal } from '@bitler/signal';
import { jsonDocuments } from '@bitler/json-documents';
import { llm } from '@bitler/llm';
import { knowledgeBases } from '@bitler/knowledge-bases';
import { notifications } from '@bitler/notifications';

const config: Configuration = {
  extensions: [llm, notifications, knowledgeBases, timers, game, jsonDocuments, homeassistant, music, linear, signal],
};

export { config };
