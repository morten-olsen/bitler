import { useCapabilities } from '@bitlerjs/react';
import { useOpenScreen } from '../screens/screens.hooks.js';
import { Capability } from '../capability/capability.js';
import { Input, Listbox, ListboxItem, ListboxSection } from '@nextui-org/react';
import { Activity, Search } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Page } from '../../components/layouts/page/page.js';

type IconWrapperProps = {
  children: React.ReactNode;
  className?: string;
};
const IconWrapper = ({ children, className }: IconWrapperProps) => (
  <div className={clsx(className, 'flex items-center rounded-small justify-center w-7 h-7')}>{children}</div>
);

const Capabilities = () => {
  const capabilities = useCapabilities();
  const open = useOpenScreen();
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      capabilities.filter((capability) => {
        const searchText = `${capability.name} ${capability.group}`;
        return searchText.toLowerCase().includes(search.toLowerCase());
      }),
    [capabilities, search],
  );

  const grouped = useMemo(
    () =>
      filtered.reduce(
        (acc, capability) => {
          if (!acc[capability.group]) {
            acc[capability.group] = [];
          }
          acc[capability.group].push(capability);
          return acc;
        },
        {} as Record<string, typeof capabilities>,
      ),
    [filtered],
  );

  return (
    <Page>
      <Page.Header>
        <Page.Content>
          <Input
            startContent={<Search />}
            placeholder="Search capabilities..."
            value={search}
            onValueChange={setSearch}
          />
        </Page.Content>
      </Page.Header>
      <Page.Body>
        <Page.Content>
          <Listbox selectionMode="none">
            {Object.entries(grouped).map(([group, capabilities]) => (
              <ListboxSection key={group} title={group} showDivider>
                {capabilities.map((capability) => (
                  <ListboxItem
                    startContent={
                      <IconWrapper className="bg-success/10 text-success">
                        <Activity />
                      </IconWrapper>
                    }
                    key={capability.kind}
                    description={capability.description}
                    onPress={() =>
                      open('capability', {
                        title: `${capability.name} - ${group}`,
                        focus: true,
                        props: {
                          kind: capability.kind,
                        },
                      })
                    }
                  >
                    {capability.name}
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

export { Capabilities };
