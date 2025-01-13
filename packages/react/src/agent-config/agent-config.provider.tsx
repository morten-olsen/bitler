import React, { ReactNode } from "react";
import { AgentConfigContext, AgentConfigType } from "./agent-config.hooks.js";

type AgentConfigProviderProps = {
  children: ReactNode;
  context: AgentConfigType;
}

const AgentConfigProvider = ({ children, context }: AgentConfigProviderProps) => {
  return (
    <AgentConfigContext.Provider value={context}>
      {children}
    </AgentConfigContext.Provider>
  );
}

export { AgentConfigProvider };
