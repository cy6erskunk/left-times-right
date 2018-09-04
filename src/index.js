// @flow
import * as React from 'react'
import ReactDOM from 'react-dom'

import App from './components/App/App'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import registerServiceWorker from './registerServiceWorker'
import './styles.css'

const rootElement = document.getElementById('root')
if (rootElement) {
  ReactDOM.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>,
    rootElement,
  )
}
registerServiceWorker()
