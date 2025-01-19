import React, { ReactNode, useMemo } from 'react';
import { ClientProvider } from './client/client.provider.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type BitlerProviderProps = {
  baseUrl: string;
  token: string;
  children: ReactNode;
  loader?: ReactNode;
};

const BitlerProvider = ({ baseUrl, token, children, loader }: BitlerProviderProps) => {
  const queryClient = useMemo(() => new QueryClient(), [baseUrl]);
  return (
    <QueryClientProvider client={queryClient}>
      <ClientProvider loader={loader} baseUrl={baseUrl} token={token}>
        {children}
      </ClientProvider>
    </QueryClientProvider>
  );
};

export * from './client/client.hooks.js';
export * from './conversations/conversations.js';
export * from './notifications/notifications.js';
export * from '@bitlerjs/client';

export { BitlerProvider };
