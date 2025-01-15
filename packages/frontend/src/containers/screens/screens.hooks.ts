import { useContext } from "react"
import { ScreensContext } from "./screens.context.js"

const useScreensContext = () => {
  const context = useContext(ScreensContext);
  if (!context) {
    throw new Error("useScreensContext must be used within a ScreensProvider");
  }

  return context;
}

const useOpenScreen = () => {
  const { show } = useScreensContext();
  return show;
}

export { useScreensContext, useOpenScreen }
