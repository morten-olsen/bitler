import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app.js'

const start = () => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

export { start };
