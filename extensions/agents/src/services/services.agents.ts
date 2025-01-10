import { Agent, Agents, agentSchema, Container, Databases } from "@bitler/core";
import { databaseConfig } from "../database/database.js";

class CustomAgents {
  #customAgents: Agent[] = [];
  #container: Container;

  constructor(container: Container) {
    this.#container = container;
  }

  public get customAgents() {
    return this.#customAgents;
  }

  public setup = async () => {
    const agentsService = this.#container.get(Agents);
    agentsService.unregister(this.#customAgents.map((agent) => agent.kind));
    const dbs = this.#container.get(Databases);
    const db = await dbs.get(databaseConfig);

    const capabilityRows = await db('agentCapabilities').select('*');
    const subAgentRows = await db('agentSubAgents').select('*');
    const agentRows = await db('agents').select('*');

    const agents = agentRows.map((agent) => ({
      kind: agent.kind,
      name: agent.name,
      group: agent.group || undefined,
      description: agent.description,
      discoverCapabilities: agent.discoverCapabilities || undefined,
      discoverAgents: agent.discoverAgents || undefined,
      capabilities: capabilityRows.filter((capability) => capability.agentKind === agent.kind).map((capability) => capability.capabilityKind),
      agents: subAgentRows.filter((subAgent) => subAgent.agentKind === agent.kind).map((subAgent) => subAgent.subAgentKind),
    }))

    agents.forEach((agent) => agentSchema.parse(agent));
    this.#customAgents = agents;
    agentsService.register(agents);
  }

  public remove = async (kinds: string[]) => {
    const dbs = this.#container.get(Databases);
    const db = await dbs.get(databaseConfig);

    await db.transaction(async (trx) => {
      await trx('agentCapabilities').whereIn('agentKind', kinds).delete();
      await trx('agentSubAgents').whereIn('agentKind', kinds).delete();
      await trx('agents').whereIn('kind', kinds).delete();
    });

    this.#customAgents = this.#customAgents.filter((agent) => !kinds.includes(agent.kind));

    this.#container.get(Agents).unregister(kinds);
  }

  public set = async (agent: Agent) => {
    const dbs = this.#container.get(Databases);
    const db = await dbs.get(databaseConfig);

    await db.transaction(async (trx) => {
      await trx('agentCapabilities').where('agentKind', agent.kind).delete();
      await trx('agentSubAgents').where('agentKind', agent.kind).delete();
      await trx('agents').where('kind', agent.kind).delete();

      await trx('agents').insert({
        kind: agent.kind,
        name: agent.name,
        group: agent.group,
        description: agent.description,
      });

      if (agent.capabilities?.length) {
        await trx('agentCapabilities').insert(agent.capabilities.map((capability) => ({
          agentKind: agent.kind,
          capabilityKind: capability,
        })));
      }

      if (agent.agents?.length) {
        await trx('agentSubAgents').insert(agent.agents.map((subAgent) => ({
          agentKind: agent.kind,
          subAgentKind: subAgent,
        })));
      }
    });

    const current = this.#customAgents.find((a) => a.kind === agent.kind);
    if (current) {
      this.#customAgents = this.#customAgents.map((a) => a.kind === agent.kind ? agent : a);
      const agentsService = this.#container.get(Agents);
      agentsService.unregister([current.kind]);
    }
    this.#customAgents.push(agent);
    this.#container.get(Agents).register([agent]);
  }
}

export { CustomAgents };
