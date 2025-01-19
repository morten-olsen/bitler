import { Button, Card, CardBody, CardFooter, CardHeader, Input } from '@nextui-org/react';
import { Bot, LogIn } from 'lucide-react';
import React, { createContext, ReactNode, useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type SessionData = {
  baseUrl: string;
  token: string;
};

type LoginContextValue = {
  sessionData: SessionData;
  logout: () => void;
};

const LoginContext = createContext<LoginContextValue | undefined>(undefined);

type LoginProps = {
  children: ReactNode;
};

const getSessionData = (): SessionData | undefined => {
  try {
    const sessionData = localStorage.getItem('sessionData');
    if (sessionData) {
      return JSON.parse(sessionData);
    }
  } catch (e) {
    console.error('Failed to get session data', e);
  }
  return undefined;
};

const Login = ({ children }: LoginProps) => {
  const [sessionData, setSessionData] = useState(getSessionData());

  const form = useForm<SessionData>({
    shouldFocusError: true,
    mode: 'all',
  });
  const { errors } = form.formState;

  const baseUrlInput = form.register('baseUrl', { required: 'Base URL is required' });
  const baseUrlValue = form.watch('baseUrl');
  const baseUrlError = errors.baseUrl?.message;

  const tokenInput = form.register('token', { required: 'Token is required' });
  const tokenValue = form.watch('token');
  const tokenError = errors.token?.message;

  const onSubmit: SubmitHandler<SessionData> = useCallback((data) => {
    localStorage.setItem('sessionData', JSON.stringify(data));
    setSessionData(data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sessionData');
    setSessionData(undefined);
  }, []);

  if (!sessionData || !sessionData.baseUrl || !sessionData.token) {
    return (
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex items-center justify-center h-screen p-4">
          <Card className="flex-1 max-w-96">
            <CardHeader className="flex justify-center">
              <div className="text-4xl text-center font-bold flex items-center gap-2 pt-2">
                <Bot className="stroke-default-500 rotate-12" size={40} /> Bitler
              </div>
            </CardHeader>
            <CardBody className="gap-4">
              <Input
                value={baseUrlValue || ''}
                required
                onValueChange={(e) => form.setValue('baseUrl', e)}
                onBlur={baseUrlInput.onBlur}
                onChange={baseUrlInput.onChange}
                label="URL"
                placeholder="https://example.com"
                isInvalid={!!baseUrlError}
                errorMessage={baseUrlError}
              />
              <Input
                label="Access Token"
                placeholder="eyJhbGciOi..."
                value={tokenValue || ''}
                required
                onValueChange={(e) => form.setValue('token', e)}
                onBlur={tokenInput.onBlur}
                onChange={tokenInput.onChange}
                isInvalid={!!tokenError}
                errorMessage={tokenError}
              />
            </CardBody>
            <CardFooter className="justify-end">
              <Button variant="flat" startContent={<LogIn />} className="flex-1" color="primary" type="submit">
                Login
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    );
  }

  return <LoginContext.Provider value={{ sessionData, logout }}>{children}</LoginContext.Provider>;
};

const useLogout = () => {
  const context = React.useContext(LoginContext);
  if (context === undefined) {
    throw new Error('useLogout must be used within a LoginContext');
  }
  return context.logout;
};

const useSessionData = () => {
  const context = React.useContext(LoginContext);
  if (context === undefined) {
    throw new Error('useSessionData must be used within a LoginContext');
  }
  return context.sessionData;
};

export { Login, LoginContext, useLogout, useSessionData };
