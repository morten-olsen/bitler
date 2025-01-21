import React from 'react';
import { Container } from './containers/container/container.js';
import { Login } from './containers/login/login.js';
import { injectStyles } from '@stoplight/mosaic';
import { ToastsProvider } from './containers/toasts/toasts.provider.js';

injectStyles();

const App = () => {
  return (
    <ToastsProvider>
      <Login>
        <Container />
      </Login>
    </ToastsProvider>
  );
};

export { App };
