import { useEventEffect, useRunCapabilityMutation, useRunCapabilityQuery } from '@bitlerjs/react';
import { Button } from '@nextui-org/react';
import React, { useCallback, useEffect, useState } from 'react';
import { JsonSchemaViewer } from '@stoplight/json-schema-viewer';
import YAML from 'yaml';
import { Editor } from '../../components/editor/editor.js';
import { Page } from '../../components/layouts/page/page.js';
import { Play } from 'lucide-react';
import { useAddToast } from '../toasts/toasts.hooks.js';

type CapabilityProps = {
  kind: string;
};

const Config = ({ kind }: CapabilityProps) => {
  const addToast = useAddToast();
  const { data, refetch } = useRunCapabilityQuery(
    'configs.get',
    { kind },
    {
      queryKey: ['configs.get', kind],
    },
  );
  const { data: details } = useRunCapabilityQuery(
    'configs.describe',
    { kind },
    {
      queryKey: ['configs.describe', kind],
    },
  );
  const { value } = data || {};
  const [input, setInput] = useState(YAML.stringify(value || {}));

  const setMutation = useRunCapabilityMutation('configs.set', {
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
    'configs.updated',
    { kind },
    () => {
      refetch();
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
              {!!details?.config?.schema && <JsonSchemaViewer schema={details?.config.schema} />}
            </div>
            <div className="flex-1">
              <Editor height="100%" defaultLanguage="yaml" value={input} onChange={(e) => setInput(e || '')} />
            </div>
            <div className="flex gap-4 justify-end">
              <Button color="primary" isIconOnly onPress={run} isLoading={setMutation.isLoading}>
                <Play />
              </Button>
            </div>
          </div>
        </div>
      </Page.Body>
    </Page>
  );
};

export { Config };
