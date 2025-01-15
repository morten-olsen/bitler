import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app.js';

const start = () => {
  const root = document.getElementById('root');
  if (!root) {
    throw new Error('Root element not found');
  }
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

export { start };
