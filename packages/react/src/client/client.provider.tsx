import React, { type ReactNode, useMemo } from 'react';
import { ClientContext } from './client.context.js';
import { useQuery } from '@tanstack/react-query';
import { Client } from '@bitlerjs/client';

type ClientProviderProps = {
  baseUrl: string;
  children: ReactNode;
  loader?: ReactNode;
};

const ClientProvider = ({ baseUrl, children, loader }: ClientProviderProps) => {
  const client = useMemo(() => new Client({ baseUrl }), [baseUrl]);
  const setup = useQuery({
    queryKey: ['setup', baseUrl],
    queryFn: async () => {
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

  if (!setup.data) {
    return loader;
  }

  return <ClientContext.Provider value={{ client, ...setup.data }}>{children}</ClientContext.Provider>;
};

export { ClientProvider };
