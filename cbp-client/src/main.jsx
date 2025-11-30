import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './components/common'

// HashRouter is used for GitLab Pages - no server configuration needed
// URLs will use hash: https://mandal-minds.gitlab.io/cubictree/#/dashboard
console.log('CBP App Initializing...')
console.log('Base URL:', import.meta.env.BASE_URL)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <ToastProvider>
        <App />
      </ToastProvider>
    </HashRouter>
  </StrictMode>,
)
