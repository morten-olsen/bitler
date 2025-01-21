import { useEventEffect, useRunCapabilityMutation, useRunCapabilityQuery } from '@bitlerjs/react';
import { useOpenScreen } from '../screens/screens.hooks.js';
import { Badge, Button, Input, Listbox, ListboxItem, ListboxSection } from '@nextui-org/react';
import { Check, Cog, Search, Trash } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Page } from '../../components/layouts/page/page.js';
import { useAddToast } from '../toasts/toasts.hooks.js';

type IconWrapperProps = {
  children: React.ReactNode;
  className?: string;
};
const IconWrapper = ({ children, className }: IconWrapperProps) => (
  <div className={clsx(className, 'flex items-center rounded-small justify-center w-7 h-7')}>{children}</div>
);

const Configs = () => {
  const { data, refetch } = useRunCapabilityQuery('configs.list', {});
  useEventEffect(
    'configs.updated',
    {},
    () => {
      refetch();
    },
    [],
  );
  useEventEffect(
    'config.value-changed',
    {},
    () => {
      refetch();
    },
    [],
  );
  const addToast = useAddToast();
  const configs = data?.configs || [];
  const open = useOpenScreen();
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      configs.filter((config) => {
        const searchText = `${config.name} ${config.group}`;
        return searchText.toLowerCase().includes(search.toLowerCase());
      }),
    [configs, search],
  );

  const removeMutation = useRunCapabilityMutation('configs.remove', {
    onError: () => {
      addToast({
        title: 'Error',
        type: 'error',
        timeout: 5000,
      });
    },
    onSuccess: () => {
      addToast({
        title: 'Config removed',
        type: 'success',
        timeout: 3000,
      });
    },
  });

  const grouped = useMemo(
    () =>
      filtered.reduce(
        (acc, config) => {
          const groupName = config.group || 'Other';
          if (!acc[groupName]) {
            acc[groupName] = [];
          }
          acc[groupName].push(config);
          return acc;
        },
        {} as Record<string, typeof configs>,
      ),
    [filtered],
  );

  return (
    <Page>
      <Page.Header>
        <Page.Content>
          <Input startContent={<Search />} placeholder="Search configs..." value={search} onValueChange={setSearch} />
        </Page.Content>
      </Page.Header>
      <Page.Body>
        <Page.Content>
          <Listbox selectionMode="none">
            {Object.entries(grouped).map(([group, configs]) => (
              <ListboxSection key={group} title={group} showDivider>
                {configs.map((config) => (
                  <ListboxItem
                    startContent={
                      <Badge
                        placement="bottom-left"
                        isInvisible={!config.hasConfig}
                        isOneChar
                        className="bg-success/10 text-success"
                        content={<Check size={12} />}
                        isDot
                        showOutline={false}
                        size="md"
                      >
                        <IconWrapper className="text-default-500">
                          <Cog />
                        </IconWrapper>
                      </Badge>
                    }
                    key={config.kind}
                    description={config.description}
                    onPress={() =>
                      open('config', {
                        title: `${config.name} - ${group}`,
                        focus: true,
                        props: {
                          kind: config.kind,
                        },
                      })
                    }
                    endContent={
                      config.hasConfig ? (
                        <div className="flex gap-4">
                          <Button
                            size="sm"
                            variant="flat"
                            color="danger"
                            isIconOnly
                            isLoading={removeMutation.variables?.kind === config.kind && removeMutation.isLoading}
                            onPress={() => removeMutation.mutate({ kind: config.kind })}
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      ) : undefined
                    }
                  >
                    {config.name}
                  </ListboxItem>
                ))}
              </ListboxSection>
            ))}
          </Listbox>
        </Page.Content>
      </Page.Body>
    </Page>
  );
};

export { Configs };
