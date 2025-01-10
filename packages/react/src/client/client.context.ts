import { Client, CapabilityOutput, DefaultServer, ServerSchema } from "@bitler/client"
import { createContext, useContext } from "react";

type ClientContextValue<
  TServerSchema extends ServerSchema = DefaultServer
> = {
  client: Client<TServerSchema>;
  capabilities: CapabilityOutput<DefaultServer, 'builtin.list-capabilities'>['all'];
  agents: CapabilityOutput<DefaultServer, 'builtin.list-agents'>['agents']
  models: any[];
}

const ClientContext = createContext<ClientContextValue | undefined>(undefined);

const useClientContext = <
  TServerSchema extends ServerSchema = DefaultServer
>(): ClientContextValue<TServerSchema> => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClientContext must be used within a ClientProvider');
  }
  return context as any as ClientContextValue<TServerSchema>;
}

export { ClientContext, useClientContext };

