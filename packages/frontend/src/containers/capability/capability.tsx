import { DefaultServer, useCapability, useRunCapabilityQuery } from '@bitlerjs/react';
import { Button } from '@nextui-org/react';
import React, { useCallback, useState } from 'react';
import YAML from 'yaml';
import { Editor } from '../../components/editor/editor.js';
import { Page } from '../../components/layouts/page/page.js';
import { Play } from 'lucide-react';
import { useAddToast } from '../toasts/toasts.hooks.js';
import { JsonSchema } from '../../components/json-schema/json-schema.js';
import { JSONSchema4Type } from 'json-schema';

type CapabilityProps = {
  kind: keyof DefaultServer['capabilities'];
};

const Capability = ({ kind }: CapabilityProps) => {
  const capability = useCapability(kind);
  const addToast = useAddToast();
  const { data: details } = useRunCapabilityQuery(
    'capabilities.describe',
    { kind },
    {
      queryKey: ['capabilities.describe', kind],
    },
  );
  const [input, setInput] = useState('{}');

  const run = useCallback(async () => {
    const json = YAML.parse(input);
    capability.mutate(json, {
      onError: (err) => {
        console.error('Error', err);
        addToast({
          title: 'Error while running capability',
          type: 'error',
          description: String(err),
          timeout: 5000,
        });
      },
      onSuccess: () => {
        addToast({
          title: 'Success',
          type: 'success',
          timeout: 3000,
        });
      },
    });
  }, [capability.mutate, input]);

  return (
    <Page>
      <Page.Body>
        <div className="h-full flex gap-8 p-8">
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex-1 overflow-y-auto">
              {!!details?.capability?.input && <JsonSchema schema={details.capability.input as JSONSchema4Type} />}
            </div>
            <div className="flex-1">
              {!!details?.capability?.output && <JsonSchema schema={details.capability.output as JSONSchema4Type} />}
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex-1">
              <Editor defaultLanguage="yaml" value={input} onChange={(e) => setInput(e || '')} />
            </div>
            <div className="flex gap-4 justify-end">
              <Button
                color="primary"
                startContent={<Play />}
                onPress={run}
                isLoading={capability.isLoading}
                disabled={capability.isLoading}
              >
                Run
              </Button>
            </div>
            <div className="flex-1">
              <Editor value={YAML.stringify(capability.data)} options={{ readOnly: true }} defaultLanguage="yaml" />
            </div>
          </div>
        </div>
      </Page.Body>
    </Page>
  );
};

export { Capability };
