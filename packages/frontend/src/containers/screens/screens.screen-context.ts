import { createContext, useContext } from "react";

type ScreenValue = {
  active: boolean;
  id: string;
}

const ScreenContext = createContext<ScreenValue | undefined>(undefined);

const useScreenActive = () => {
  const context = useContext(ScreenContext);
  if (!context) {
    return true;
  }
  if (context === undefined) {
    throw new Error('useScreenActive must be used within a ScreenProvider');
  }
  return context.active;
}

export { ScreenContext, useScreenActive };
