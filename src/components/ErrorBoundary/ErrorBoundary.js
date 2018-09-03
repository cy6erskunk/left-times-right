// @flow
import * as React from 'react'

import {logError} from '../../helpers'
import type {ErrorInfo} from '../../types'

type State = {|hasError: boolean|}

class ErrorBoundary extends React.Component<{children?: React.Node}, State> {
  state = {hasError: false}

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({hasError: true})
    logError(error, info)
  }

  clickButton = () => window.location.reload()

  render() {
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
