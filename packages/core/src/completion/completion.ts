import OpenAI from "openai";
import { Agents } from "../agents/agents.js";
import { Capabilities } from "../capabilities/capabilities.js";
import { Context, Contexts } from "../contexts/contexts.js";
import { Container, z, ZodSchema } from "../exports.js";
import { Models } from "../models/models.js";
import { CompletionDialog, CompletionOptions } from "./completion.schemas.js";
import { Capability } from "../capabilities/capabilities.capability.js";
import { getJsonSchema } from "../utils/zod.js";
import { Agent } from "../agents/agents.schemas.js";
import { excludeUndefined } from "../utils/basic.js";
import { ActionRequestInstance, ActionRequests } from "../action-requests/action-requests.js";
import { agentSession, Session } from "../session/session.js";
import { history } from "../history/history.js";

const sanitizeString = (str: string) => {
  return str.replace(/[^a-zA-Z0-9_-]/g, "_");
}

type ConvertContext<TContext> = {
  context: TContext,
  actionRequests?: ActionRequestInstance,
  session: Session,
}
class Completion {
  #container: Container;

  constructor(container: Container) {
    this.#container = container;
  }

  #convertCapabilities = (capabilities: Capability<any, any>[], options: ConvertContext<Context>) => {
    const capabilityService = this.#container.get(Capabilities);
    return capabilities.map((capability) => ({
      type: 'function',
      function: {
        name: sanitizeString(capability.kind),
        function: async (input: unknown) => {
          try {
            const params = capability.input.parse(input);
            const result = await capabilityService.run({
              capability,
              input: params,
              context: options.context,
              actionRequests: options.actionRequests,
              session: options.session,
            });
            return result;
          } catch (e: any) {
            console.error(e);
            return `The call failed with error: ${e.message}`;
          }
        },
        parse: JSON.parse,
        description: capability.agentDescription || capability.description || capability.kind,
        parameters: getJsonSchema(capability.input) as any,
      },
    }))
  }

  #convertAgents = (agents: Agent[], context: ConvertContext<Record<string, unknown> | undefined>) => {
    return agents.map((agent) => ({
      type: 'function',
      function: {
        name: sanitizeString(agent.kind),
        function: async (options: { prompt: string }) => {
          const result = await this.complete({
            agent: agent.kind,
            prompt: options.prompt,
            context: context.context,
            actionRequests: context.actionRequests,
            session: context.session,
          });
          return result.response;
        },
        parse: JSON.parse,
        description: agent.description,
        parameters: getJsonSchema(z.object({
          prompt: z.string(),
        })) as any,
      },
    }))
  }

  #getDialog = (options: CompletionOptions, context: Context) => {
    const agentService = this.#container.get(Agents);
    const [agent] = options.agent ? agentService.get([options.agent]) : [];
    const systemPrompt = options.systemPrompt || agent?.systemPrompt;

    const dialog: CompletionDialog[] = [];
    if (systemPrompt) {
      dialog.push({ role: "system", content: systemPrompt });
    }
    if (context.hasValues) {
      const contextDescription = context.describe();
      dialog.push({ role: "system", content: contextDescription });
    }
    if (options.dialog) {
      dialog.push(...options.dialog);
    }
    dialog.push({ role: "user", content: options.prompt });
    return dialog;
  }

  #getCapabilities = async (options: CompletionOptions) => {
    const capabilityService = this.#container.get(Capabilities);
    const agentService = this.#container.get(Agents);

    const [agent] = options.agent ? agentService.get([options.agent]) : [];

    const capabilities = capabilityService.get([
      ...(options.capabilities || []),
      ...(agent?.capabilities || []),
      ...(await capabilityService.find(options.prompt, options.discoverCapabilities || 0)).map((result) => result.capability.kind),
    ]);
    return capabilities;
  }

  #getAgents = async (options: CompletionOptions) => {
    const agentService = this.#container.get(Agents);
    const [agent] = options.agent ? agentService.get([options.agent]) : [];
    const agents = agentService.get([
      ...(options.agents || []),
      ...(agent?.agents || []),
      ...(await agentService.find(options.prompt, options.discoverAgents || 0)).map((result) => result.agent.kind),
    ]);
    return agents;
  }

  public complete = async <TSchema extends ZodSchema | undefined = undefined>(
    options: CompletionOptions & {
      schema?: TSchema,
      actionRequests?: ActionRequestInstance,
      session?: Session,
    }
  ): Promise<{
    response: TSchema extends ZodSchema ? z.infer<TSchema> : string,
    context: Record<string, unknown>,
    actionRequests: { kind: string, value: unknown, description?: string }[],
  }> => {
    const modelService = this.#container.get(Models);
    const contextService = this.#container.get(Contexts);
    const actionRequestService = this.#container.get(ActionRequests);

    const actionRequests = options.actionRequests || actionRequestService.create();
    const model = modelService.get(options.model);
    const capabilities = await this.#getCapabilities(options);
    const agents = await this.#getAgents(options);

    const contextSetups = capabilities.flatMap(
      (capability) => capability?.setup ? capability.setup : []
    );
    const session = new Session();
    session.set(agentSession, {
      agent: options.agent,
      model: model.id,
      capabilities: capabilities.flatMap((capability) => capability ? [capability.kind] : []),
      agents: agents.flatMap((agent) => agent ? [agent.kind] : []),
    });
    const context = await contextService.create({
      setups: contextSetups,
      init: options.context,
      session,
    });

    const tools: any = [
      ...this.#convertCapabilities(excludeUndefined(capabilities), {
        context,
        actionRequests,
        session,
      }),
      ...this.#convertAgents(excludeUndefined(agents), {
        context: options.context,
        actionRequests,
        session,
      }),
    ];
    const dialog = this.#getDialog(options, context);

    const client = new OpenAI({
      baseURL: model.api,
      apiKey: model.token,
    });

    const getResponse = async () => {
      if (tools.length > 0) {
        const runner = client.beta.chat.completions.runTools({
          messages: dialog,
          max_tokens: options.maxTokens,
          tools,
          model: model.modelName,
        })
        const finalContent = await runner.finalContent();
        if (!finalContent) {
          throw new Error('No final content');
        }

        return finalContent;
      } else {
        const completion = await client.chat.completions.create({
          messages: dialog,
          max_tokens: options.maxTokens,
          model: model.modelName,
        })

        const result = completion.choices[0]?.message?.content;
        if (!result) {
          throw new Error('No result');
        }
        return result;
      }
    }

    const response = await getResponse();

    if (options.conversationId) {
      const capabilitiesService = this.#container.get(Capabilities);
      await capabilitiesService.run({
        capability: history.set,
        session,
        input: {
          id: options.conversationId,
          systemPrompt: options.systemPrompt || null,
          agent: options.agent || null,
          discoverAgents: options.discoverAgents || 0,
          discoverCapabilies: options.discoverCapabilities || 0,
          capabilities: capabilities.flatMap((capability) => capability ? [capability.kind] : []),
          agents: agents.flatMap((agent) => agent ? [agent.kind] : []),
        }
      });
      await capabilitiesService.run({
        capability: history.addMessages,
        session,
        input: [{
          conversationId: options.conversationId,
          role: "user",
          content: options.prompt,
        }, {
          conversationId: options.conversationId,
          role: "assistant",
          content: response,
        }]
      });
    }

    return {
      response: response as any,
      context: context.toJSON(),
      actionRequests: actionRequests.toJSON(),
    }
  }
}

export * from "./completion.schemas.js";
export { Completion };
