import { createContext, useCallback, useContext, useState } from "react";


type AgentConfig = {
  agent?: string;
  model?: string;
  capabilities?: string[];
  agents?: string[];
  systemPrompt?: string;
  discoverCapabilites?: number;
  discoverAgents?: number;
}

const useAgentConfig = (init?: AgentConfig) => {
  const [config, setConfig] = useState<AgentConfig>(init || {});
  return [
    config,
    setConfig,
  ] as const;
}

type AgentConfigType = ReturnType<typeof useAgentConfig>;

const AgentConfigContext = createContext<AgentConfigType | undefined>(undefined);

const useAgentConfigContext = (): AgentConfigType => {
  const context = useContext(AgentConfigContext);
  const stub = useCallback(() => { }, []);
  if (!context) {
    return [
      {},
      stub,
    ];
  }
  return context;
}

export { useAgentConfig, useAgentConfigContext, AgentConfigContext, AgentConfig, type AgentConfigType };


