import { cos_sim } from "@huggingface/transformers";
import { Agent } from "./agents.schemas.js";
import { Container, EventEmitter, FeatureExtractor, Vector } from "@bitler/core";

type AgentsEvents = {
  registered: (agents: Agent[]) => void;
};

class Agents extends EventEmitter<AgentsEvents> {
  #container: Container;
  #agents: Set<Agent> = new Set();
  #agentsVectors: Map<Agent, Vector> = new Map();

  constructor(container: Container) {
    super();
    this.#container = container;
  }

  #getVector = async (agent: Agent) => {
    if (!this.#agentsVectors.has(agent)) {
      const extractor = this.#container.get(FeatureExtractor);
      const description = [
        `Name: ${agent.name}`,
        `Group: ${agent.group}`,
        '',
        'Description:',
        agent.description,
      ].join('\n');
      const [vector] = await extractor.extract([description]);
      this.#agentsVectors.set(agent, vector);
    }
    const vector = this.#agentsVectors.get(agent);
    if (!vector) {
      throw new Error('Vector not found');
    }
    return vector;
  }

  public register = (argents: Agent[]) => {
    argents.forEach((agent) => {
      this.#agents.add(agent);
    });
    this.emit('registered', argents);
  }

  public unregister = (kinds: string[]) => {
    this.#agents = new Set(Array.from(this.#agents).filter((agent) => !kinds.includes(agent.kind)));
  }

  public list = () => {
    return Array.from(this.#agents);
  }

  public get = (kinds: string[]) => {
    const array = this.list();
    return kinds.map((kind) => {
      return array.find((agent) => agent.kind === kind);
    });
  }

  public find = async (query: string, limit: number = 5) => {
    if (limit === 0) {
      return [];
    }
    const extractor = this.#container.get(FeatureExtractor);
    const [queryVector] = await extractor.extract([query]);
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
  }
}

const createAgent = (agent: Agent) => agent;

export * from './agents.schemas.js';
export { createAgent, Agents };
