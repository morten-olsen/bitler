import React, { ReactNode, useCallback } from 'react';
import { useScreensContext } from '../screens.hooks';
import { ScreenContext } from '../screens.screen-context';
import { availableScreens } from '../screens.context';

type ScreenProps = {
  id: string;
  node: ReactNode;
};
const Sceen = ({ id, node }: ScreenProps) => {
  const { selected, setTitle } = useScreensContext();
  const setTitleAction = useCallback(
    (title: string) => {
      setTitle(id, title);
    },
    [id, setTitle],
  );
  return (
    <ScreenContext.Provider
      value={{
        active: id === selected,
        id: id,
        setTitle: setTitleAction,
      }}
    >
      {node}
    </ScreenContext.Provider>
  );
};
const ScreensItem = () => {
  const { screens, selected } = useScreensContext();

  return (
    <div className="flex-1 overflow-y-auto">
      {screens.map(({ id, component, props = {} }) => {
        const Component = availableScreens[component];
        return (
          <div
            key={id}
            className="h-full w-full overflow-y-auto"
            style={{ display: id === selected ? 'block' : 'none' }}
          >
            <Sceen id={id} node={<Component {...props} />} />
          </div>
        );
      })}
    </div>
  );
};

export { ScreensItem };
