import React, { ReactNode, useMemo } from 'react';
import { ClientProvider } from './client/client.provider.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type BitlerProviderProps = {
  baseUrl: string;
  children: ReactNode;
};

const BitlerProvider = ({ baseUrl, children }: BitlerProviderProps) => {
  const queryClient = useMemo(() => new QueryClient(), [baseUrl]);
  return (
    <QueryClientProvider client={queryClient}>
      <ClientProvider baseUrl={baseUrl}>{children}</ClientProvider>
    </QueryClientProvider>
  );
};

export * from './client/client.hooks.js';
export * from './conversations/conversations.js';
export * from './notifications/notifications.js';
export * from '@bitlerjs/client';

export { BitlerProvider };
