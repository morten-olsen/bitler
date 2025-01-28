import { useCallback } from 'react';
import { createTypedHooks } from '../client/client.js';
import { DefaultServer } from '@bitlerjs/client';

const { useCapabilityQuery, useCapabilityMutation, useEventEffect } = createTypedHooks<DefaultServer>();

const useNotifications = () => {
  const notifications = useCapabilityQuery({
    kind: 'notification.list',
    input: {},
    queryKey: ['notification.list'],
  });

  const removeNotificationsMutation = useCapabilityMutation({
    kind: 'notification.remove',
  });

  const removeNotifications = useCallback(
    (ids: string[]) => {
      removeNotificationsMutation.mutate({ ids });
    },
    [removeNotificationsMutation.mutate],
  );

  useEventEffect(
    {
      kind: 'notification.created',
      input: {},
      handler: () => {
        notifications.refetch();
      },
    },
    [notifications.refetch],
  );

  useEventEffect(
    {
      kind: 'notification.removed',
      input: {},
      handler: () => {
        notifications.refetch();
      },
    },
    [notifications.refetch],
  );
  return {
    ...notifications,
    notifications: notifications.data?.notifications || [],
    removeNotifications,
  };
};

export { useNotifications };
