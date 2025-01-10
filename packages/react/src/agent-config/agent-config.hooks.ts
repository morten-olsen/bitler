import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const useAgentConfig = (init?: AgentConfigValues) => {
  const [agent, setAgent] = useState<string | undefined>(init?.agent);
  const [model, setModel] = useState<string | undefined>(init?.model);
  const [capabilities, setCapabilities] = useState<string[]>(init?.capabilities || []);
  const [agents, setAgents] = useState<string[]>(init?.agents || []);
  const [systemPrompt, setSystemPrompt] = useState<string | undefined>(init?.systemPrompt);
  const [discoverCapabilites, setDiscoverCapabilities] = useState<number | undefined>(init?.discoverCapabilites);
  const [discoverAgents, setDiscoverAgents] = useState<number | undefined>(init?.discoverAgents);
  const clear = useCallback(() => {
    setAgent(undefined);
    setModel(undefined);
    setCapabilities([]);
    setAgents([]);
    setDiscoverCapabilities(undefined);
    setDiscoverAgents(undefined);
  }, []);

  const context = {
    agent,
    model,
    capabilities,
    agents,
    systemPrompt,
    discoverCapabilites,
    discoverAgents,
    setAgent,
    setModel,
    setCapabilities,
    setAgents,
    setDiscoverCapabilities,
    setDiscoverAgents,
    setSystemPrompt,
    clear,
  }

  return context;
}

type AgentConfigValues = {
  agent?: string;
  model?: string;
  capabilities?: string[];
  agents?: string[];
  systemPrompt?: string;
  discoverCapabilites?: number;
  discoverAgents?: number;
}

const useSetAgentConfigValues = () => {
  const context = useAgentConfigContext();
  const fn = useCallback((values: AgentConfigValues) => {

    context.setAgent(values.agent);
    context.setModel(values.model);
    context.setCapabilities(values.capabilities || []);
    context.setAgents(values.agents || []);
    context.setSystemPrompt(values.systemPrompt);
    context.setDiscoverCapabilities(values.discoverCapabilites);
    context.setDiscoverAgents(values.discoverAgents);
  }, []);

  return fn;
}

const useAgentConfigValues = () => {
  const context = useAgentConfigContext();
  const result = useMemo<AgentConfigValues>(() => {
    return {
      agent: context.agent,
      model: context.model,
      capabilities: context.capabilities,
      agents: context.agents,
      systemPrompt: context.systemPrompt,
      discoverCapabilites: context.discoverCapabilites,
      discoverAgents: context.discoverAgents,
    }
  }, [context.agent, context.model, context.capabilities, context.agents, context.systemPrompt, context.discoverCapabilites, context.discoverAgents]);
  return result;
}

type AgentConfig = ReturnType<typeof useAgentConfig>;

const AgentConfigContext = createContext<AgentConfig | undefined>(undefined);

const useAgentConfigContext = () => {
  const context = useContext(AgentConfigContext);
  if (!context) {
    throw new Error('useAgentConfigContext must be used within a AgentConfigProvider');
  }
  return context;
}

const useMemorisedAgentConfig = (key = 'agent-config') => {
  const [ready, setReady] = useState(false);
  const values = useAgentConfigValues();
  const setValues = useSetAgentConfigValues();
  useEffect(() => {
    const storageValue = localStorage.getItem(key);
    if (storageValue) {
      const value = JSON.parse(storageValue);
      setValues(value);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    localStorage.setItem(key, JSON.stringify(values));
  }, [values, ready]);
};

const MemorisedAgentConfig = () => {
  useMemorisedAgentConfig();
  return null;
}

export { useAgentConfig, useAgentConfigContext, AgentConfigContext, AgentConfig, useAgentConfigValues, useSetAgentConfigValues, useMemorisedAgentConfig, MemorisedAgentConfig, type AgentConfigValues };


