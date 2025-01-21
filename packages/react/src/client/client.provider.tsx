import React, { ComponentType, type ReactNode, useEffect, useMemo } from 'react';
import { ClientContext } from './client.context.js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Client } from '@bitlerjs/client';
type ClientErrorProps = {
  error: string;
  loading: boolean;
  retry: () => void;
};
type ClientProviderProps = {
  baseUrl: string;
  token: string;
  children: ReactNode;
  loader?: ReactNode;
  error?: ComponentType<ClientErrorProps>;
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

const ClientProvider = ({ baseUrl, token, children, loader, error: ErrorComponent }: ClientProviderProps) => {
  const client = useMemo(() => new Client({ baseUrl, token }), [baseUrl]);
  const queryClient = useQueryClient();
  const setup = useQuery({
    queryKey: ['setup', baseUrl],
    queryFn: async () => {
      await client.ready();
      const { capabilities } = client;
      const { capabilities: capabilitiesList } = await capabilities.run('capabilities.list', {});
      const { agents: agentList } = await capabilities.run('agents.list', {});
      const { models: modelList } = await capabilities.run('models.list', {});
      return {
        capabilities: capabilitiesList,
        agents: agentList,
        models: modelList,
      };
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      client.events.subscribe(
        'capabilities.updated',
        {},
        () => {
          queryClient.invalidateQueries({
            queryKey: ['setup', baseUrl],
          });
        },
        {
          signal: controller.signal,
        },
      );
      client.events.subscribe(
        'models.updated',
        {},
        () => {
          queryClient.invalidateQueries({
            queryKey: ['setup', baseUrl],
          });
        },
        {
          signal: controller.signal,
        },
      );
    };
    run();
    return () => {
      client.close();
      controller.abort();
    };
  }, [client, baseUrl]);

  if (setup.error && ErrorComponent) {
    return <ErrorComponent error={getErrorMessage(setup.error)} loading={setup.isLoading} retry={setup.refetch} />;
  }

  if (!setup.data) {
    return loader;
  }

  return <ClientContext.Provider value={{ client, ...setup.data }}>{children}</ClientContext.Provider>;
};

export { ClientProvider };
