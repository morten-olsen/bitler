import React, { type ReactNode, useMemo } from "react";
import { ClientContext } from "./client.context.js";
import { useQuery } from "@tanstack/react-query";
import { Client } from "@bitler/client";

type ClientProviderProps = {
  baseUrl: string;
  children: ReactNode;
};

const ClientProvider = ({ baseUrl, children }: ClientProviderProps) => {
  const client = useMemo(() => new Client({ baseUrl }), [baseUrl]);
  const setup = useQuery({
    queryKey: ['setup', baseUrl],
    queryFn: async () => {
      const { capabilities } = client;
      const { all: capabilitiesList } = await capabilities.run('builtin.list-capabilities', {});
      const { agents: agentList } = await capabilities.run('builtin.list-agents', {});
      return {
        capabilities: capabilitiesList,
        agents: agentList,
        models: [],
      }
    },
    onError: (error) => {
      console.error(error);
    }
  });

  if (!setup.data) {
    return null;
  }

  return (
    <ClientContext.Provider value={{ client, ...setup.data }}>
      {children}
    </ClientContext.Provider>
  );
}

export { ClientProvider };
