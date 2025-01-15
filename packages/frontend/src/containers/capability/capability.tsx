import { useCapability } from "@bitler/react";
import { Button } from "@nextui-org/react";
import React, { useCallback, useState } from "react";
import YAML from 'yaml';
import { Editor } from "../../components/editor/editor.js";

type CapabilityProps = {
  kind: string;
};

const Capability = ({ kind }: CapabilityProps) => {
  const capability = useCapability(kind);
  const [input, setInput] = useState<any>('{}');

  const run = useCallback(
    async () => {
      const json = YAML.parse(input);
      capability.mutate(json);
    },
    [capability.mutate, input]
  )
  return (
    <div className="flex h-full gap-4 pt-4">
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex-1">
          <Editor
            height="100%"
            theme="vs-dark"
            defaultLanguage="yaml"
            value={input}
            onChange={(e) => setInput(e)}
          />
        </div>
        <Button
          onPress={run}
        >Run</Button>
      </div>
      <div className="flex-1 flex flex-col">
        <Editor
          value={YAML.stringify(capability.data)}
          theme="vs-dark"
          options={{ readOnly: true }}
          defaultLanguage="yaml"
          height="100%"
        />
      </div>
    </div>
  );
}

export { Capability };
