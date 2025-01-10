import { useCapabilities } from "@bitler/react"
import { useOpenScreen } from "../screens/screens.hooks";
import { Capability } from "../capability/capability";
import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { Play } from "lucide-react";

const Capabilities = () => {
  const capabilities = useCapabilities();
  const open = useOpenScreen();

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="flex flex-col gap-4">
        {capabilities.map((capability) => (
          <Card
            key={capability.kind} className="flex flex-col p-4"
            onPress={() => {
              open(Capability, {
                id: `capability-${capability.kind}`,
                title: `${capability.group} - ${capability.name}`,
                focus: true,
                props: {
                  kind: capability.kind,
                },
              });
            }}
          >
            <CardHeader>
              <div className="flex gap-2 justify-between">
                <div className="font-semibold">{capability.name}</div>
                <div className="text-default-500">{capability.group}</div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="text-xs">{capability.description}</div>
            </CardBody>
            <CardFooter>
              <Button
                onPress={() => {
                  open(Capability, {
                    id: `capability-${capability.kind}`,
                    title: `${capability.group} - ${capability.name}`,
                    focus: true,
                    props: {
                      kind: capability.kind,
                    },
                  });
                }}
              ><Play />Run</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export { Capabilities }
