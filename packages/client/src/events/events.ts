import { BitlerServer } from "../generated/types.js";
import { ServerSchema } from "../types/server.js";

type EventInput<TSchema extends ServerSchema, TKind extends keyof TSchema["events"] | string> =
  TKind extends keyof TSchema["events"] ? TSchema["events"][TKind]["input"] : unknown;

type EventOutput<TSchema extends ServerSchema, TKind extends keyof TSchema["events"] | string> =
  TKind extends keyof TSchema["events"] ? TSchema["events"][TKind]["output"] : unknown;

type EventsOptions = {
  baseUrl: string;
}

const decoder = new TextDecoder();

class Events<TSchema extends ServerSchema = BitlerServer> {
  #options: EventsOptions;

  constructor(options: EventsOptions) {
    this.#options = options;
  }

  public subscribe = async <
    TKind extends keyof TSchema["capabilities"],
  >(
    kind: TKind,
    input: EventInput<TSchema, TKind>,
    handler: (output: EventOutput<TSchema, TKind>) => void,
  ) => {
    const response = await fetch(`${this.#options.baseUrl}/api/events/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'keep-alive': 'true',
      },
      body: JSON.stringify({ kind, input }),
    });
    console.log('response', response);
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader');
    }
    const abortController = new AbortController();

    const task = async () => {
      while (true) {
        if (abortController.signal.aborted) {
          break;
        }
        const { value, done } = await reader.read();
        const asString = value ? decoder.decode(value) : '';
        console.log(asString);
        const split = asString.split('\n').filter(Boolean);
        for (const chunk of split) {
          const content = JSON.parse(chunk);
          handler(content);
        }
        if (done) {
          break;
        }
      }
      if (!reader.closed) {
        reader.cancel();
      }
    }
    task();

    return {
      unsubscribe: abortController.abort,
    }
  }
}

export { Events, type EventInput, type EventOutput };
