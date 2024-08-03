import * as React from 'react'

import {logError} from '../../helpers'
import type {ErrorInfo} from '../../types'

type State = {
  hasError: boolean
}

class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode
  },
  State
> {
  state: State = {hasError: false}

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.setState({hasError: true})
    logError(error, info)
  }

  clickButton: () => void = () => window.location.reload()

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className={'fatalError'}>
          <div className={'fatalErrorMessage'}>
            <h1>{'Something went wrong.'}</h1>
            <button onClick={this.clickButton}>{'try reloading page 🔄'}</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
export default ErrorBoundary
