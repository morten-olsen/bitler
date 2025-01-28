import { ServerSchema } from '@bitlerjs/client';
import { useMutation, MutationOptions } from '@tanstack/react-query';

import { useBitler } from '../provider/provider.js';

type MutationType<T extends ServerSchema, TKey extends keyof T['capabilities']> = typeof useMutation<
  T['capabilities'][TKey]['output'],
  unknown,
  T['capabilities'][TKey]['input']
>;

const useCapabilityMutation = <T extends ServerSchema, TKey extends keyof T['capabilities']>({
  kind,
  ...options
}: MutationOptions<T['capabilities'][TKey]['output'], unknown, T['capabilities'][TKey]['input'], unknown> & {
  kind: TKey;
}): ReturnType<MutationType<T, TKey>> => {
  const { client, queryClient } = useBitler<T>();
  return useMutation(
    {
      ...options,
      mutationFn: async (input) => {
        const result = await client?.capabilities.run(kind, input);
        return result;
      },
    },
    queryClient,
  );
};

const createMutationHooks = <T extends ServerSchema>() => {
  const typesUseCapabilityMutation = <TKey extends keyof T['capabilities']>(
    ...args: Parameters<typeof useCapabilityMutation<T, TKey>>
  ) => useCapabilityMutation(...args);

  return {
    useCapabilityMutation: typesUseCapabilityMutation,
  };
};

export { useCapabilityMutation, createMutationHooks };
