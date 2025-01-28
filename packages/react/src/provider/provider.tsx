import { Client, type ServerSchema } from '@bitlerjs/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type LoginOptions = {
  baseUrl: string;
  token: string;
};

type LoginState = 'pending' | 'not-logged-in' | 'logging-in' | 'logged-in';

type BitlerOptions = {
  getSession?: () => Promise<LoginOptions | undefined>;
  setSession?: (session?: LoginOptions) => Promise<void>;
};

const useCreateBitler = <T extends ServerSchema = ServerSchema>({ getSession, setSession }: BitlerOptions) => {
  const [state, setState] = useState<LoginState>('pending');
  const [client, setClient] = useState<Client<T>>();
  const [error, setError] = useState<unknown>();
  const queryClient = useMemo(() => new QueryClient(), [client]);

  const login = useCallback(async (options: LoginOptions) => {
    setState('logging-in');
    setError(undefined);
    try {
      const nextClient = new Client<T>({
        baseUrl: options.baseUrl,
        token: options.token,
      });
      setClient(nextClient);
      await setSession?.(options);
      setState('logged-in');
    } catch (err) {
      setError(err);
      setState('not-logged-in');
    }
  }, []);

  const logout = useCallback(() => {
    setState('not-logged-in');
    setClient(undefined);
    setSession?.();
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        setError(undefined);
        const session = await getSession?.();
        if (session) {
          await login(session);
        } else {
          setState('not-logged-in');
        }
      } catch (err) {
        setError(err);
      }
    };
    run();
  }, []);

  return {
    state,
    error,
    client,
    login,
    logout,
    queryClient,
  };
};

type BitlerContextValue<T extends ServerSchema = ServerSchema> = ReturnType<typeof useCreateBitler<T>>;

const BitlerContext = createContext<BitlerContextValue | undefined>(undefined);

type BitlerProviderProps = BitlerContextValue & {
  children: ReactNode;
};

const BitlerProvider = ({ children, ...props }: BitlerProviderProps) => {
  return (
    <QueryClientProvider client={props.queryClient}>
      <BitlerContext.Provider value={props}>{children}</BitlerContext.Provider>
    </QueryClientProvider>
  );
};

const useBitler = <T extends ServerSchema = ServerSchema>() => {
  const context = useContext(BitlerContext);
  if (!context) {
    throw new Error('Missing login provider');
  }
  return context as BitlerContextValue<T>;
};

const useIsConnected = () => {
  const { client } = useBitler();
  const [connected, setConnected] = useState(!!client?.connected);

  useEffect(() => {
    if (!client) {
      return;
    }
    setConnected(!!client.connected);
    const onConnect = () => {
      setConnected(true);
    };
    const onDisconnect = () => {
      setConnected(false);
    };
    client.addListener('connected', onConnect);
    client.addListener('disconnected', onDisconnect);

    return () => {
      client.removeListener('connected', onConnect);
      client.removeListener('disconnected', onDisconnect);
    };
  }, [client]);

  return connected;
};

export { BitlerProvider, useBitler, useCreateBitler, useIsConnected };
