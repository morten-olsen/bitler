import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Listbox,
  ListboxItem,
  useDisclosure,
} from '@nextui-org/react';
import React, { useMemo } from 'react';
import { Sidebar } from '../../sidebar/sidebar';
import { Menu, NotebookText, X } from 'lucide-react';
import { useNavigateEffect, useScreensContext } from '../screens.hooks';

const MobileHeader = () => {
  const menuDisclosure = useDisclosure();
  const screenDisclosure = useDisclosure();
  useNavigateEffect(() => menuDisclosure.onClose(), []);
  const { screens, selected, setSelected, close } = useScreensContext();
  const selectedScreen = useMemo(() => screens.find((screen) => screen.id === selected), [screens, selected]);
  return (
    <>
      <div className="flex items-center px-4 gap-4">
        <Button variant="light" isIconOnly onPress={menuDisclosure.onOpen}>
          <Menu />
        </Button>
        {screens.length > 0 && (
          <Button startContent={<NotebookText />} variant="light" onPress={screenDisclosure.onOpen}>
            {selectedScreen?.title}
          </Button>
        )}
      </div>
      <Drawer backdrop="blur" placement="top" {...screenDisclosure}>
        <DrawerContent>
          <DrawerHeader>Screens</DrawerHeader>
          <DrawerBody>
            <Listbox
              items={screens}
              selectedKeys={selected ? [selected] : []}
              selectionMode="single"
              isVirtualized={false}
              onSelectionChange={(keys) => {
                if (!(keys instanceof Set)) {
                  return;
                }
                const key = keys.values().next().value;
                if (!key) {
                  return;
                }
                setSelected(String(key));
                screenDisclosure.onClose();
              }}
            >
              {(screen) => (
                <ListboxItem
                  endContent={
                    <Button variant="light" color="danger" isIconOnly onPress={() => close(screen.id)}>
                      <X />
                    </Button>
                  }
                  key={screen.id}
                >
                  {screen.title}
                </ListboxItem>
              )}
            </Listbox>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Drawer backdrop="blur" placement="left" {...menuDisclosure}>
        <DrawerContent>
          <DrawerBody>
            <Sidebar />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export { MobileHeader };
