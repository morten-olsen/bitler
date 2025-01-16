import React from 'react';
import { Tab, Tabs } from '@nextui-org/react';
import { useScreensContext } from './screens.hooks.js';
import { X } from 'lucide-react';
import { ScreenContext } from './screens.screen-context.js';

const Screens = () => {
  const { screens, selected, setSelected, close } = useScreensContext();

  return (
    <div className="h-full flex-1 flex flex-col py-4 gap-4">
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

      <div className="flex-1 overflow-y-auto">
        {screens.map((screen) => (
          <div
            key={screen.id}
            className="h-full w-full overflow-y-auto"
            style={{ display: screen.id === selected ? 'block' : 'none' }}
          >
            <ScreenContext.Provider value={{ active: screen.id === selected, id: screen.id }}>
              {screen.node}
            </ScreenContext.Provider>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Screens };
