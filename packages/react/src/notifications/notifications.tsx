import { useCallback } from 'react';
import { useEventEffect, useRunCapabilityMutation, useRunCapabilityQuery } from '../client/client.hooks.js';

const useNotifications = () => {
  const notifications = useRunCapabilityQuery('notification.list', {});

  const removeNotificationsMutation = useRunCapabilityMutation('notification.remove', {});

  const removeNotifications = useCallback(
    (ids: string[]) => {
      removeNotificationsMutation.mutate({ ids });
    },
    [removeNotificationsMutation.mutate],
  );

  useEventEffect(
    'notification.created',
    {},
    () => {
      notifications.refetch();
    },
    [notifications.refetch],
  );

  useEventEffect(
    'notification.removed',
    {},
    () => {
      notifications.refetch();
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
