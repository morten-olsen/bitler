import { createTypedHooks, DefaultServer, useBitler } from '@bitlerjs/react';

const { useCapabilityMutation, useCapabilityQuery, useEventEffect } = createTypedHooks<DefaultServer>();

const useAgents = () => {
  const result = useCapabilityQuery({
    kind: 'agents.list',
    queryKey: ['agents.list'],
    input: {},
  });

  return result;
};

const useModels = () => {
  const { queryClient } = useBitler();
  const result = useCapabilityQuery({
    kind: 'models.list',
    queryKey: ['models.list'],
    input: {},
  });

  useEventEffect(
    {
      kind: 'models.updated',
      input: {},
      handler: () => {
        queryClient.invalidateQueries({
          queryKey: ['models.list'],
        });
      },
    },
    [queryClient],
  );

  return result;
};

export { useCapabilityQuery, useCapabilityMutation, useEventEffect, useAgents, useModels };
