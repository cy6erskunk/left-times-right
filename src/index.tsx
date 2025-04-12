import * as React from 'react'
import { createRoot } from 'react-dom/client'

import App from './components/App/App'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import registerServiceWorker from './registerServiceWorker'
import './styles.css'

const rootElement = document.getElementById('root')
if (rootElement) {
  const root = createRoot(rootElement)
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>,
  )
}
registerServiceWorker()
