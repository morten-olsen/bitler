import React, { useCallback, useEffect, useMemo } from 'react';
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Input,
  Textarea,
  type useDisclosure,
} from '@nextui-org/react';
import { useAgents, useCapabilities, useConversationContext } from '@bitlerjs/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Tagbar } from '../../components/base/tagbar/tagbar';

type ConversationSettingsProps = ReturnType<typeof useDisclosure>;
type SettingsType = Parameters<ReturnType<typeof useConversationContext>['setSettings']>[0];

const ConversationSettings = (props: ConversationSettingsProps) => {
  const conversation = useConversationContext();
  const actualSettings = useMemo<SettingsType>(
    () => ({
      title: conversation.title,
      agent: conversation.agent,
      description: conversation.description,
      capabilities: conversation.capabilities,
      agents: conversation.agents,
      discoverCapabilties: conversation.discoverCapabilities,
      discoverAgents: conversation.discoverAgents,
    }),
    [
      conversation.title,
      conversation.agent,
      conversation.description,
      conversation.capabilities,
      conversation.agents,
      conversation.discoverCapabilities,
      conversation.discoverAgents,
    ],
  );
  const form = useForm<SettingsType>({
    defaultValues: actualSettings,
  });

  useEffect(() => {
    form.reset(actualSettings);
  }, [actualSettings]);

  const onSubmit: SubmitHandler<SettingsType> = (data) => {
    conversation.setSettings(data, {
      onSuccess: () => {
        props.onClose();
      },
    });
  };

  const reset = useCallback(() => form.reset(actualSettings), [actualSettings]);

  const availableAgents = useAgents();
  const availableCapabilities = useCapabilities();

  form.register('title');
  form.register('description');
  form.register('agent');
  form.register('capabilities');
  form.register('agents');
  form.register('discoverCapabilities', {
    valueAsNumber: true,
  });
  form.register('discoverAgents', {
    valueAsNumber: true,
  });

  const titleValue = form.watch('title');
  const descriptionValue = form.watch('description');
  const agentValue = form.watch('agent');
  const capabilitiesValue = form.watch('capabilities');
  const agentsValue = form.watch('agents');
  const discoverCapabilitiesValue = form.watch('discoverCapabilities');
  const discoverAgentsValue = form.watch('discoverAgents');

  return (
    <Drawer {...props} backdrop="blur">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DrawerContent>
          <DrawerBody>
            <DrawerHeader>Settings</DrawerHeader>
            <DrawerBody>
              <Input
                label="Title"
                value={(titleValue as string) || ''}
                onValueChange={(value) => form.setValue('title', value)}
              />
              <Textarea
                label="Description"
                value={(descriptionValue as string) || ''}
                onValueChange={(value) => form.setValue('description', value)}
                minRows={1}
              />
              <Autocomplete
                defaultItems={availableAgents}
                label="Agent"
                selectedKey={agentValue as string}
                onSelectionChange={(value) => form.setValue('agent', value as string)}
              >
                {(item) => <AutocompleteItem key={item.kind}>{item.name}</AutocompleteItem>}
              </Autocomplete>
              <Tagbar
                label="Add capabilities"
                selected={capabilitiesValue as string[]}
                onSelectedChange={(items) => form.setValue('capabilities', items)}
                getKey={(item) => item.kind}
                items={availableCapabilities}
                renderOption={(item) => (
                  <div>
                    <div className="text-xs text-default-500">{item.group}</div>
                    <div>{item.name}</div>
                  </div>
                )}
              />
              <Tagbar
                label="Add agents"
                selected={agentsValue as string[]}
                onSelectedChange={(items) => form.setValue('agents', items)}
                getKey={(item) => item.kind}
                items={availableAgents}
                renderOption={(item) => (
                  <div>
                    <div className="text-xs text-default-500">{item.group}</div>
                    <div>{item.name}</div>
                  </div>
                )}
              />
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="1"
                  label="Discover capabilities"
                  value={discoverCapabilitiesValue?.toString() || '0'}
                  onValueChange={(value) => form.setValue('discoverCapabilities', parseInt(value, 10))}
                />
                <Input
                  type="number"
                  step="1"
                  label="Discover agents"
                  value={discoverAgentsValue?.toString() || '0'}
                  onValueChange={(value) => form.setValue('discoverAgents', parseInt(value, 10))}
                />
              </div>
              <Checkbox>Save conversation</Checkbox>
            </DrawerBody>
            <DrawerFooter>
              <Button color="danger" variant="light" onPress={reset}>
                Reset
              </Button>
              <Button type="submit" color="primary">
                Save
              </Button>
            </DrawerFooter>
          </DrawerBody>
        </DrawerContent>
      </form>
    </Drawer>
  );
};

export { ConversationSettings };
