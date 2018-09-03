// @flow
import {MIN_NUMBER, MAX_NUMBER} from './constants'
import type {ErrorInfo} from './types'

export const generateDigit = () => Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER
export const logError = (error: Error, info: ErrorInfo) => console.error(error, info.stack)
