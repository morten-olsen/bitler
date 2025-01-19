import React from 'react';
import { Container } from './containers/container/container.js';
import { Login } from './containers/login/login.js';

const App = () => {
  return (
    <Login>
      <Container />
    </Login>
  );
};

export { App };
