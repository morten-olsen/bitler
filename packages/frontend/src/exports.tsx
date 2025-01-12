import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app'

const start = () => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

export { start };
