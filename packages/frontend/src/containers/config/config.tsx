import { Button } from '@nextui-org/react';
import React, { useCallback, useEffect, useState } from 'react';
import YAML from 'yaml';
import { Editor } from '../../components/editor/editor.js';
import { Page } from '../../components/layouts/page/page.js';
import { Play } from 'lucide-react';
import { useAddToast } from '../toasts/toasts.hooks.js';
import { JsonSchema } from '../../components/json-schema/json-schema.js';
import { JSONSchema4Type } from 'json-schema';
import { useCapabilityMutation, useCapabilityQuery, useEventEffect } from '../../hooks/bitler.js';

type CapabilityProps = {
  kind: string;
};

const Config = ({ kind }: CapabilityProps) => {
  const addToast = useAddToast();
  const { data, refetch } = useCapabilityQuery({
    kind: 'configs.get',
    input: { kind },
    queryKey: ['configs.get', kind],
  });
  const { data: details } = useCapabilityQuery({
    kind: 'configs.describe',
    input: { kind },
    queryKey: ['configs.describe', kind],
  });
  const { value } = data || {};
  const [input, setInput] = useState(YAML.stringify(value || {}));

  const setMutation = useCapabilityMutation({
    kind: 'configs.set',
    onError: (err) => {
      console.error('Error', err);
      addToast({
        title: 'Could not update config',
        type: 'error',
        description: String(err),
        timeout: 5000,
      });
    },
    onSuccess: () => {
      addToast({
        title: 'Config updated',
        type: 'success',
        timeout: 3000,
      });
    },
  });

  useEventEffect(
    {
      kind: 'configs.updated',
      input: { kind },
      handler: () => {
        refetch();
      },
    },
    [kind, refetch],
  );

  const run = useCallback(async () => {
    setMutation.mutate({ kind, value: YAML.parse(input) });
  }, [input]);

  useEffect(() => {
    setInput(YAML.stringify(value || {}));
  }, [value]);

  return (
    <Page>
      <Page.Body>
        <div className="h-full flex gap-4">
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex-1">
              {!!details?.config?.schema && <JsonSchema schema={details?.config.schema as JSONSchema4Type} />}
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                defaultLanguage="yaml"
                value={input}
                onChange={(e) => setInput(e || '')}
                footer={
                  <div className="flex w-full gap-4 justify-end">
                    <Button color="primary" isIconOnly onPress={run} isLoading={setMutation.isPending}>
                      <Play />
                    </Button>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </Page.Body>
    </Page>
  );
};

export { Config };
