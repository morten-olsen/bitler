import 'dotenv/config';
import { builtin, Container, Extensions, Server } from '@bitler/core';
import { homeassistant } from '@bitler/homeassistant';
import { timers } from '@bitler/timers';
import { music } from '@bitler/music';
import { agents } from '@bitler/agents';
import { linear } from '@bitler/linear';
import { game } from '@bitler/game';
import { signal } from '@bitler/signal';
import { jsonDocuments } from '@bitler/json-documents';
import { fileURLToPath, resolve } from 'url';
import fastifyStatic from '@fastify/static';

const container = new Container();
const extensions = container.get(Extensions);

await extensions.register([
  builtin,
  agents,
  timers,
  game,
  jsonDocuments,
  homeassistant,
  music,
  linear,
  signal,
]);

const server = container.get(Server);
const app = await server.create({
  setup: async (app) => {
    const pkgLocation = import.meta.resolve('@bitler/frontend/package.json');
    const root = fileURLToPath(pkgLocation);
    const dist = resolve(root, 'dist');
    await app.register(fastifyStatic, {
      root: dist,
      wildcard: false,
    });
  },
});

await app.listen({
  port: 3000,
  host: process.env.HOST,
})
