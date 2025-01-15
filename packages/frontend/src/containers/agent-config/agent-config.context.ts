import { useDisclosure } from "@nextui-org/react";
import { createContext } from "react";

const AgentConfigContext = createContext<ReturnType<typeof useDisclosure> | undefined>(undefined);

export { AgentConfigContext };


