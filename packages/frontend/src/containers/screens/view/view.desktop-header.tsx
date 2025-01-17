import React from 'react';
import { useScreensContext } from '../screens.hooks';
import { Tab, Tabs } from '@nextui-org/react';
import { X } from 'lucide-react';

const DesktopHeader = () => {
  const { screens, selected, setSelected, close } = useScreensContext();

  return (
    <div className="flex px-4 justify-center w-full flex-shrink-0">
      <Tabs size="sm" selectedKey={selected} onSelectionChange={(key) => setSelected(key.toString())}>
        {screens.map((screen) => (
          <Tab
            key={screen.id}
            title={
              <div className="flex gap-2">
                {screen.title}
                <X
                  size={16}
                  onClick={(e) => {
                    e.stopPropagation();
                    close(screen.id);
                  }}
                />
              </div>
            }
          />
        ))}
      </Tabs>
    </div>
  );
};

export { DesktopHeader };
