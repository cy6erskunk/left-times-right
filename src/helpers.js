// @flow
import {MIN_NUMBER, MAX_NUMBER} from './constants'
import type {ErrorInfo} from './types'

export const generateDigit = (): number => Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER
export const logError = (error: Error, info: ErrorInfo): void =>
  console.error(error, info.componentStack)
