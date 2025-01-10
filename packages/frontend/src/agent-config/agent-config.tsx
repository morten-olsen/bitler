import { AgentConfig as AgentConfigContextValue, AgentConfigProvider, useAgents, useCapabilities, useModels } from "@bitler/react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { ReactNode, useContext } from "react"
import { Tagbar } from "../components/base/tagbar/tagbar";
import { AgentConfigContext } from "./agent-config.context";
import { useKeyboard } from "../hooks/hooks";
import { Label } from "../components/base/label/label";

type AgentConfigProps = AgentConfigContextValue & {
  children?: ReactNode;
  disclosure: ReturnType<typeof useDisclosure>
};

const AgentConfig = ({ children, disclosure, ...agentConfig }: AgentConfigProps) => {
  const { isOpen, onOpenChange, onOpen } = disclosure;
  const capabilities = useCapabilities();
  const agents = useAgents();
  const models = useModels();

  useKeyboard({
    key: 'p',
    ctrlKey: true,
    action: onOpen,
  });

  return (
    <AgentConfigContext.Provider value={disclosure}>
      <AgentConfigProvider {...agentConfig}>
        {children}
        <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
          <DrawerContent>
            {() => (
              <>
                <DrawerHeader className="flex flex-col gap-1">Change prompt config</DrawerHeader>
                <DrawerBody>
                  <Label title="Agent">
                    <Autocomplete
                      selectedKey={agentConfig.agent}
                      onSelectionChange={agentConfig.setAgent as any}
                      items={agents}
                    >
                      {(item) => (
                        <AutocompleteItem key={item.kind}>
                          {item.name}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                  </Label>
                  <Label title="System prompt">
                    <Textarea
                      minRows={1}
                      value={agentConfig.systemPrompt || ''}
                      onChange={(e) => agentConfig.setSystemPrompt(e.target.value || undefined)}
                    />
                  </Label>
                  <Label title="Model">
                    <Autocomplete
                      selectedKey={agentConfig.model}
                      onSelectionChange={agentConfig.setModel as any}
                      items={models}
                    >
                      {(item) => (
                        <AutocompleteItem key={item.id}>
                          {item.name}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                  </Label>
                  <Label title="Capabilities">
                    <Tagbar
                      items={capabilities}
                      getKey={(capability) => capability.kind}
                      selected={agentConfig.capabilities}
                      onSelectedChange={(capabilities) => {
                        agentConfig.setCapabilities(capabilities)
                      }}
                    >
                      {(task) => (
                        <div>
                          <div className="text-xs text-default-500">{task.group}</div>
                          <div className="text-xs">{task.name}</div>
                        </div>
                      )}
                    </Tagbar>
                  </Label>
                  <Label title="Agents">
                    <Tagbar
                      items={agents}
                      getKey={(agent) => agent.kind}
                      selected={agentConfig.agents}
                      onSelectedChange={(agents) => agentConfig.setAgents(agents)}
                    >
                      {(agent) => (
                        <div>
                          <div>{agent.name}</div>

                        </div>
                      )}
                    </Tagbar>
                  </Label>
                  <div className="flex">
                    <Label title="Discover capabilities">
                      <Input type="number" value={agentConfig.discoverCapabilites?.toString() || '0'} onChange={(e) => agentConfig.setDiscoverCapabilities(parseInt(e.target.value))} />
                    </Label>
                    <Label title="Discover agents">
                      <Input type="number" value={agentConfig.discoverAgents?.toString() || '0'} onChange={(e) => agentConfig.setDiscoverAgents(parseInt(e.target.value))} />
                    </Label>
                  </div>
                </DrawerBody>
                <DrawerFooter>
                  <Button color="danger" variant="light" onPress={agentConfig.clear}>
                    Clear
                  </Button>
                </DrawerFooter>
              </>
            )}
          </DrawerContent>
        </Drawer>
      </AgentConfigProvider>
    </AgentConfigContext.Provider>
  );
}

const useAgentConfigControls = () => {
  const context = useContext(AgentConfigContext);
  if (!context) {
    throw new Error('useAgentConfigControls must be used within an AgentConfigProvider');
  }
  return context;
};

export { AgentConfig, useAgentConfigControls };
