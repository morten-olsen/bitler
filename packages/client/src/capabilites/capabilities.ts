import type { BitlerServer } from '../generated/types.js';
import type { ServerSchema } from '../types/server.js';

type CapabilityInput<
  TSchema extends ServerSchema,
  TKind extends keyof TSchema['capabilities'] | string,
> = TKind extends keyof TSchema['capabilities'] ? TSchema['capabilities'][TKind]['input'] : unknown;

type CapabilityOutput<
  TSchema extends ServerSchema,
  TKind extends keyof TSchema['capabilities'] | string,
> = TKind extends keyof TSchema['capabilities'] ? TSchema['capabilities'][TKind]['output'] : unknown;

type CapabilitiesOptions = {
  baseUrl: string;
};
class Capabilities<TSchema extends ServerSchema = BitlerServer> {
  #options: CapabilitiesOptions;

  constructor(options: CapabilitiesOptions) {
    this.#options = options;
  }

  public run = async <TKind extends keyof TSchema['capabilities']>(
    kind: TKind,
    input: CapabilityInput<TSchema, TKind>,
  ): Promise<CapabilityOutput<TSchema, TKind>> => {
    const response = await fetch(`${this.#options.baseUrl}/api/capabilities/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ kind, input }),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    const json = await response.json();
    return json;
  };
}

export { Capabilities, type CapabilityInput, type CapabilityOutput };
