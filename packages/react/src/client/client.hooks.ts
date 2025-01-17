import { useMutation, useQuery } from '@tanstack/react-query';
import { CapabilityInput, CapabilityOutput, DefaultServer, ServerSchema } from '@bitlerjs/client';
import { EventInput, EventOutput } from '@bitlerjs/client/dist/events/events.js';
import { useEffect, useState } from 'react';

import { useClientContext } from './client.context.js';

const useCapabilities = () => {
  const context = useClientContext();
  return context.capabilities;
};

const useHasCapability = (kind: string) => {
  const capabilities = useCapabilities();
  return capabilities.find((capability) => capability.kind === kind) !== undefined;
};

const useAgents = () => {
  const context = useClientContext();
  return context.agents;
};

const useModels = () => {
  const context = useClientContext();
  return context.models;
};

type UserRunCapabilityMutationOptions = {
  mutationKey?: string[];
};

const useRunCapabilityMutation = <
  TServer extends ServerSchema = DefaultServer,
  TKind extends keyof TServer['capabilities'] = keyof TServer['capabilities'],
>(
  kind: TKind,
  options: UserRunCapabilityMutationOptions = {},
) => {
  const { client } = useClientContext<TServer>();
  return useMutation({
    mutationKey: options.mutationKey,
    mutationFn: async (params: CapabilityInput<TServer, TKind>) => {
      const { capabilities } = client;
      return capabilities.run<TKind>(kind, params);
    },
  });
};

type UserRunCapabilityQueryOptions = {
  queryKey?: string[];
};

const useEventEffect = <
  TServer extends ServerSchema = DefaultServer,
  TKind extends keyof TServer['events'] = keyof TServer['events'],
>(
  kind: TKind,
  input: EventInput<TServer, TKind>,
  handler: (output: EventOutput<TServer, TKind>) => void,
  deps: any[] = [],
) => {
  const { client } = useClientContext<TServer>();
  const [error, setError] = useState<unknown>();
  const [connected, setConnected] = useState(false);
  const { events } = client;

  useEffect(() => {
    setError(undefined);
    let unsubscribe = () => { };
    const run = async () => {
      try {
        const subscription = await events.subscribe(kind, input, handler);
        unsubscribe = subscription.unsubscribe;
        setConnected(true);
      } catch (e) {
        console.error(e);
        setError(e);
      }
    };
    run();
    return unsubscribe;
  }, [client, ...deps]);

  return { error, connected };
};

const useRunCapabilityQuery = <
  TServer extends ServerSchema = DefaultServer,
  TKind extends keyof TServer['capabilities'] = keyof TServer['capabilities'],
>(
  kind: TKind,
  input: CapabilityInput<TServer, TKind>,
  options: UserRunCapabilityQueryOptions = {},
) => {
  const { client } = useClientContext<TServer>();
  return useQuery({
    queryKey: options.queryKey,
    queryFn: async () => {
      const { capabilities } = client;
      return capabilities.run<TKind>(kind, input) as CapabilityOutput<TServer, TKind>;
    },
  });
};

const useCapability = (kind: string) => {
  const capabilities = useCapabilities();
  const definition = capabilities.find((capability) => capability.kind === kind);
  const run = useRunCapabilityMutation(kind as any);
  return {
    ...run,
    ...definition,
  };
};

const createTypedHooks = <TServer extends ServerSchema = DefaultServer>() => {
  return {
    useCapabilities,
    useAgents,
    useModels,
    useRunCapabilityMutation: <TKind extends keyof TServer['capabilities']>(
      kind: TKind,
      options: UserRunCapabilityMutationOptions = {},
    ) => useRunCapabilityMutation<TServer, TKind>(kind, options),
    useRunCapabilityQuery: <TKind extends keyof TServer['capabilities']>(
      kind: TKind,
      input: CapabilityInput<TServer, TKind>,
      options: UserRunCapabilityQueryOptions = {},
    ) => useRunCapabilityQuery<TServer, TKind>(kind, input, options),
  };
};

export {
  useCapabilities,
  useAgents,
  useModels,
  useRunCapabilityMutation,
  useEventEffect,
  useRunCapabilityQuery,
  createTypedHooks,
  useHasCapability,
  useCapability,
};
