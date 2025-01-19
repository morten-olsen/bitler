import React, { ComponentType, type ReactNode, useEffect, useMemo } from 'react';
import { ClientContext } from './client.context.js';
import { useQuery } from '@tanstack/react-query';
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
  const setup = useQuery({
    queryKey: ['setup', baseUrl],
    queryFn: async () => {
      await client.ready();
      const { capabilities } = client;
      const { capabilities: capabilitiesList } = await capabilities.run('capabilities.list', {});
      const { agents: agentList } = await capabilities.run('agents.list', {});
      return {
        capabilities: capabilitiesList,
        agents: agentList,
        models: [],
      };
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    return () => {
      client.close();
    };
  }, [client]);

  if (setup.error && ErrorComponent) {
    console.log('ErrorComponent', ErrorComponent);
    return <ErrorComponent error={getErrorMessage(setup.error)} loading={setup.isLoading} retry={setup.refetch} />;
  }

  if (!setup.data) {
    return loader;
  }

  return <ClientContext.Provider value={{ client, ...setup.data }}>{children}</ClientContext.Provider>;
};

export { ClientProvider };
