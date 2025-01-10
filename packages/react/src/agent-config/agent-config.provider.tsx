import React, { ReactNode } from "react";
import { AgentConfigContext, AgentConfig } from "./agent-config.hooks.js";

type AgentConfigProviderProps = AgentConfig & {
  children: ReactNode;
}

const AgentConfigProvider = ({ children, ...rest }: AgentConfigProviderProps) => {
  return (
    <AgentConfigContext.Provider value={rest}>
      {children}
    </AgentConfigContext.Provider>
  );
}

export { AgentConfigProvider };
