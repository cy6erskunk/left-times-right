import { MAX_NUMBER, MIN_NUMBER } from './constants'
import type { ErrorInfo } from './types'

export const generateDigit = (): number =>
  Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER
export const logError = (error: Error, info: ErrorInfo): void =>
  console.error(error, info.componentStack)

export function generateAllPairs(min = MIN_NUMBER, max = MAX_NUMBER): [number, number][] {
  const pairs: [number, number][] = []
  for (let i = min; i <= max; i++) {
    for (let j = min; j <= max; j++) {
      pairs.push([i, j])
    }
  }
  return pairs
}

export const pickRandomPair = (pairsList: [number, number][]) => {
  return pairsList[Math.floor(Math.random() * pairsList.length)]
}