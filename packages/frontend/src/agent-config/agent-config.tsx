import { AgentConfigProvider, useAgentConfigContext, useAgents, useCapabilities, useModels } from "@bitler/react";
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

type AgentConfigContextValue = ReturnType<typeof useAgentConfigContext>;

type AgentConfigProps = {
  children?: ReactNode;
  disclosure: ReturnType<typeof useDisclosure>
  context: AgentConfigContextValue;
};

const AgentConfigContainer = ({ children, disclosure, context }: AgentConfigProps) => {
  const { isOpen, onOpenChange, onOpen } = disclosure;
  const capabilities = useCapabilities();
  const agents = useAgents();
  const models = useModels();
  const [agentConfig, setAgentConfig] = context;


  useKeyboard({
    key: 'p',
    ctrlKey: true,
    action: onOpen,
  });

  return (
    <AgentConfigContext.Provider value={disclosure}>
      <AgentConfigProvider context={context}>
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
                      onSelectionChange={(value) => {
                        setAgentConfig((prev) => ({ ...prev, agent: value?.toString() }))
                      }}
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
                      onChange={(e) => {
                        setAgentConfig((prev) => ({ ...prev, systemPrompt: e.target.value }))
                      }}
                    />
                  </Label>
                  <Label title="Model">
                    <Autocomplete
                      selectedKey={agentConfig.model}
                      onSelectionChange={(value) => {
                        setAgentConfig((prev) => ({ ...prev, model: value?.toString() }))
                      }}
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
                        setAgentConfig((prev) => ({ ...prev, capabilities }));
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
                      onSelectedChange={(agents) => {
                        setAgentConfig((prev) => ({ ...prev, agents }));
                      }}
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
                      <Input
                        type="number"
                        value={agentConfig.discoverCapabilites?.toString() || '0'}
                        onChange={(e) => {
                          setAgentConfig((prev) => ({ ...prev, discoverCapabilites: parseInt(e.target.value) }))
                        }}
                      />
                    </Label>
                    <Label title="Discover agents">
                      <Input
                        type="number"
                        value={agentConfig.discoverAgents?.toString() || '0'}
                        onChange={(e) => {
                          setAgentConfig((prev) => ({ ...prev, discoverAgents: parseInt(e.target.value) }))
                        }}
                      />
                    </Label>
                  </div>
                </DrawerBody>
                <DrawerFooter>
                  <Button color="danger" variant="light" onPress={() => {
                    setAgentConfig({});
                  }}>
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

export { AgentConfigContainer, useAgentConfigControls };
