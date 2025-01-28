import { DefaultServer } from '@bitlerjs/client';
import { createTypedHooks } from '../client/client.js';
import { useBitler } from '../provider/provider.js';

const { useCapabilityQuery, useEventEffect } = createTypedHooks<DefaultServer>();

const useCapabilities = () => {
  const { queryClient } = useBitler();
  const { data, isLoading } = useCapabilityQuery({
    kind: 'capabilities.list',
    queryKey: ['capabilities.list'],
    input: {},
  });

  useEventEffect({
    kind: 'capabilities.updated',
    input: {},
    handler: () => {
      queryClient.invalidateQueries({
        queryKey: ['capabilities.list'],
      });
    },
  });

  return {
    isLoading,
    capabilities: data?.capabilities || [],
  };
};

const useHasCapability = (kind: string) => {
  const { capabilities } = useCapabilities();
  return !!capabilities.find((c) => c.kind === kind);
};

export { useCapabilities, useHasCapability };
