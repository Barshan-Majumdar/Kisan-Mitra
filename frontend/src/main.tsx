import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './i18n'
import './index.css'

import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  // throw new Error("Missing Publishable Key")
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <div style={{ padding: '20px', color: 'red', fontFamily: 'sans-serif' }}>
      <h1>Configuration Error</h1>
      <p>Missing <code>VITE_CLERK_PUBLISHABLE_KEY</code> environment variable.</p>
      <p>Please ensure the <code>.env</code> file exists and restart the development server.</p>
    </div>
  )
  throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)
