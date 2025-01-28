import React from 'react';
import { Container } from './containers/container/container.js';
import { Login } from './containers/login/login.js';
import { injectStyles } from '@stoplight/mosaic';
import { BitlerProvider, useCreateBitler } from '@bitlerjs/react';

injectStyles();

const App = () => {
  const bitler = useCreateBitler({
    getSession: async () => {
      const raw = localStorage.getItem('session');
      if (!raw) {
        return;
      }
      return JSON.parse(raw);
    },
    setSession: async (session) => {
      if (session) {
        localStorage.setItem('session', JSON.stringify(session));
      } else {
        localStorage.removeItem('session');
      }
    },
  });
  const { state } = bitler;
  return (
    <BitlerProvider {...bitler}>
      {state === 'not-logged-in' && <Login />}
      {state === 'logged-in' && <Container />}
    </BitlerProvider>
  );
};

export { App };
