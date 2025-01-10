import { Tab, Tabs } from "@nextui-org/react";
import { useScreensContext } from "./screens.hooks";
import { X } from "lucide-react";
import { ScreenContext } from "./screens.screen-context";

const Screens = () => {
  const { screens, selected, setSelected, close } = useScreensContext()

  return (
    <div className="h-full">
      <div className="p-2 h-full flex flex-col">
        <Tabs
          size="sm"
          selectedKey={selected}
          onSelectionChange={(key) => setSelected(key.toString())}
        >
          {screens.map((screen) => (
            <Tab
              key={screen.id}
              title={(
                <div className="flex gap-2">
                  {screen.title}
                  <X
                    size={16}
                    onClick={(e) => {
                      e.stopPropagation()
                      close(screen.id)
                    }}
                  />
                </div>
              )}
            />
          ))}
        </Tabs>

        <div className="flex-1 overflow-auto">
          {screens.map((screen) => (
            <div key={screen.id} className="h-full w-full" style={{ display: screen.id === selected ? 'block' : 'none' }}>
              <ScreenContext.Provider value={{ active: screen.id === selected, id: screen.id }}>
                {screen.node}
              </ScreenContext.Provider>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
};

export { Screens };
