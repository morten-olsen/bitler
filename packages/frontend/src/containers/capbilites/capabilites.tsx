import { useCapabilities } from "@bitler/react"
import { useOpenScreen } from "../screens/screens.hooks";
import { Capability } from "../capability/capability";
import { Input, Listbox, ListboxItem, ListboxSection } from "@nextui-org/react";
import { Activity, Search } from "lucide-react";
import { useMemo, useState } from "react";
import clsx from "clsx";

type IconWrapperProps = {
  children: React.ReactNode;
  className?: string;
}
const IconWrapper = ({ children, className }: IconWrapperProps) => (
  <div className={clsx(className, "flex items-center rounded-small justify-center w-7 h-7")}>
    {children}
  </div>
);

const Capabilities = () => {
  const capabilities = useCapabilities();
  const open = useOpenScreen();
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () => capabilities.filter(capability => {
      const searchText = `${capability.name} ${capability.group}`;
      return searchText.toLowerCase().includes(search.toLowerCase());
    }),
    [capabilities, search]
  )

  const grouped = useMemo(
    () => filtered.reduce((acc, capability) => {
      if (!acc[capability.group]) {
        acc[capability.group] = [];
      }
      acc[capability.group].push(capability);
      return acc;
    }, {} as Record<string, typeof capabilities>),
    [filtered]
  )


  return (
    <div className="max-w-3xl mx-auto p-8">
      <Input
        startContent={<Search />}
        placeholder="Search capabilities..."
        value={search}
        onValueChange={setSearch}
      />
      <Listbox
        selectionMode="none"
      >
        {Object.entries(grouped).map(([group, capabilities]) => (
          <ListboxSection
            key={group}
            title={group}
            showDivider
          >
            {capabilities.map((capability) => (
              <ListboxItem
                startContent={
                  <IconWrapper className="bg-success/10 text-success">
                    <Activity />
                  </IconWrapper>
                }
                key={capability.kind}
                description={capability.description}
                onPress={() => open(Capability, {
                  title: `${capability.name} - ${group}`,
                  focus: true,
                  props: {
                    kind: capability.kind
                  }
                })}
              >
                {capability.name}
              </ListboxItem>
            ))}
          </ListboxSection>
        ))}
      </Listbox>
    </div >
  )
}

export { Capabilities }
