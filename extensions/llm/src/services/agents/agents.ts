import { cos_sim } from '@huggingface/transformers';
import { Container, createId, Databases, EventEmitter, FeatureExtractor, Vector } from '@bitlerjs/core';

import { agentsDBConfig } from '../../databases/databases.js';

import { Agent } from './agents.schemas.js';

type AgentsEvents = {
  registered: (agents: Agent[]) => void;
};

class Agents extends EventEmitter<AgentsEvents> {
  #container: Container;
  #agents = new Set<Agent>();
  #agentsVectors = new Map<Agent, Vector>();

  constructor(container: Container) {
    super();
    this.#container = container;
  }

  #getVector = async (agent: Agent) => {
    if (!this.#agentsVectors.has(agent)) {
      const extractor = this.#container.get(FeatureExtractor);
      const description = [`Name: ${agent.name}`, `Group: ${agent.group}`, '', 'Description:', agent.description].join(
        '\n',
      );
      const [vector] = await extractor.extract({
        input: [description],
      });
      this.#agentsVectors.set(agent, vector);
    }
    const vector = this.#agentsVectors.get(agent);
    if (!vector) {
      throw new Error('Vector not found');
    }
    return vector;
  };

  public register = (argents: Agent[]) => {
    argents.forEach((agent) => {
      this.#agents.add(agent);
    });
    this.emit('registered', argents);
  };

  public unregister = (kinds: string[]) => {
    this.#agents = new Set(Array.from(this.#agents).filter((agent) => !kinds.includes(agent.kind)));
  };

  public list = () => {
    return Array.from(this.#agents);
  };

  public get = (kinds: string[]) => {
    const array = this.list();
    return kinds.map((kind) => {
      return array.find((agent) => agent.kind === kind);
    });
  };

  public loadAgents = async () => {
    const dbs = this.#container.get(Databases);
    const db = await dbs.get(agentsDBConfig);

    const agents = await db('agents');
    const agentCapabilities = await db('agentCapabilities');
    const agentAgents = await db('agentAgents');

    this.register(
      agents.map((agent) => ({
        ...agent,
        capabilities: agentCapabilities
          .filter((capability) => capability.agentKind === agent.kind)
          .map((capability) => capability.capabilityKind),
        agents: agentAgents.filter((a) => a.agentKind === agent.kind).map((a) => a.agentAgentKind),
      })),
    );
  };

  public setCustomAgent = async (agent: Agent) => {
    const dbs = this.#container.get(Databases);
    const db = await dbs.get(agentsDBConfig);
    await db.transaction(async (trx) => {
      await trx('agents')
        .insert({
          kind: agent.kind,
          name: agent.name,
          group: agent.group,
          description: agent.description,
          discoverCapabilities: agent.discoverCapabilities,
          discoverAgents: agent.discoverAgents,
        })
        .onConflict(['kind'])
        .merge();
      await db('agentCapabilities').where('agentKind', agent.kind).delete();
      await db('agentAgents').where('agentKind', agent.kind).delete();
      if (agent.capabilities?.length) {
        await db('agentCapabilities').insert(
          agent.capabilities.map((capability) => ({
            agentKind: agent.kind,
            capabilityKind: capability,
          })),
        );
      }
      if (agent.agents?.length) {
        await db('agentAgents').insert(
          agent.agents.map((agentAgent) => ({
            agentKind: agent.kind,
            agentAgentKind: agentAgent,
          })),
        );
      }
    });

    this.unregister([agent.kind]);
    this.register([agent]);
  };

  public find = async (query: string, limit = 5) => {
    if (limit === 0) {
      return [];
    }
    const extractor = this.#container.get(FeatureExtractor);
    const [queryVector] = await extractor.extract({
      input: [query],
    });
    const results = await Promise.all(
      Array.from(this.#agents).map(async (agent) => {
        await this.#getVector(agent);
        const vector = await this.#getVector(agent);
        const similarity = cos_sim(queryVector.value, vector.value);
        return { agent, similarity };
      }),
    );
    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, limit);
  };
}

const createAgent = (agent: Agent) => agent;

export * from './agents.schemas.js';
export { createAgent, Agents };
