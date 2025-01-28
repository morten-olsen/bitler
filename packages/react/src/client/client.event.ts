import { ServerSchema } from '@bitlerjs/client';
import { useEffect } from 'react';

import { useBitler } from '../provider/provider.js';

type UseEventEffectOptions<T extends ServerSchema, TKey extends keyof T['events']> = {
  kind: TKey;
  input: T['events'][TKey]['input'];
  handler: (event: T['events'][TKey]['output']) => unknown;
};

const useEventEffect = <T extends ServerSchema, TKey extends keyof T['events']>(
  options: UseEventEffectOptions<T, TKey>,
  deps: unknown[] = [],
) => {
  const { kind, input, handler } = options;
  const { client } = useBitler();

  useEffect(() => {
    if (!client) {
      return;
    }
    const promise = client.events.subscribe(kind as string, input, handler);
    return () => {
      promise.then((subscription) => {
        subscription.unsubscribe();
      });
    };
  }, [kind, client, ...deps]);
};

const createEventHooks = <T extends ServerSchema>() => {
  const typesUseEventsEffect = <TKey extends keyof T['events']>(...args: Parameters<typeof useEventEffect<T, TKey>>) =>
    useEventEffect(...args);

  return {
    useEventEffect: typesUseEventsEffect,
  };
};

export { useEventEffect, createEventHooks };
