import { ServerSchema } from '@bitlerjs/client';
import { useQuery, QueryOptions } from '@tanstack/react-query';

import { useBitler } from '../provider/provider.js';

type QueryType<T extends ServerSchema, TKey extends keyof T['capabilities']> = typeof useQuery<
  T['capabilities'][TKey]['input'],
  unknown,
  T['capabilities'][TKey]['output']
>;

const useCapabilityQuery = <T extends ServerSchema, TKey extends keyof T['capabilities']>({
  kind,
  input,
  ...options
}: QueryOptions<unknown, unknown, T['capabilities'][TKey]['output']> & {
  kind: TKey;
  queryKey: readonly unknown[];
  input: T['capabilities'][TKey]['input'];
}): ReturnType<QueryType<T, TKey>> => {
  const { client, queryClient } = useBitler<T>();
  return useQuery(
    {
      ...options,
      queryFn: async () => {
        const result = await client?.capabilities.run(kind, input);
        return result;
      },
    },
    queryClient,
  );
};

const createQueryHooks = <T extends ServerSchema>() => {
  const typesUseCapabilityQuery = <TKey extends keyof T['capabilities']>(
    ...args: Parameters<typeof useCapabilityQuery<T, TKey>>
  ) => useCapabilityQuery(...args);

  return {
    useCapabilityQuery: typesUseCapabilityQuery,
  };
};

export { useCapabilityQuery, createQueryHooks };
