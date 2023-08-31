import React from 'react'
import {render, screen, act} from '@testing-library/react'
import '@testing-library/jest-dom'

import {INITIAL_SCORE, INITIAL_HEARTS, TOP_SCORE_KEY} from '../constants'
import App, {scenes, getTopScore, setTopScore} from '../components/App/App'

const {START, GAME, END} = scenes

test('renders without crashing', () => {
  render(<App />)
  expect(screen.getByRole('main')).toBeInTheDocument()
})

test('is initialized correctly', () => {
  const {getByLabelText, queryByLabelText} = render(<App />)

  expect(getByLabelText('start')).toBeInTheDocument()
  expect(queryByLabelText('scores')).not.toBeInTheDocument()
  expect(queryByLabelText('final score')).not.toBeInTheDocument()
})

test('sets main scene correctly', () => {
  render(<App />)
  act(() => screen.getByRole('button').click())

  expect(screen.getByLabelText('score').textContent).toBe(String(INITIAL_SCORE))
  expect(screen.queryByLabelText('lives').textContent.length).toBe(INITIAL_HEARTS * 2)

  expect(screen.queryByLabelText('start')).not.toBeInTheDocument()
  expect(screen.getByLabelText('scores')).toBeInTheDocument()
  expect(screen.queryByLabelText('final score')).not.toBeInTheDocument()
})

it('renders outro when lives are gone', () => {
  jest.useFakeTimers()

  render(<App />)
  act(() => screen.getByRole('button').click())

  act(() => jest.advanceTimersByTime(5000))
  act(() => jest.advanceTimersByTime(5000))
  act(() => jest.advanceTimersByTime(5000))

  expect(screen.queryByLabelText('start')).not.toBeInTheDocument()
  expect(screen.queryByLabelText('scores')).not.toBeInTheDocument()
  expect(screen.getByLabelText('final score')).toBeInTheDocument()
})

describe('getTopScore', () => {
  beforeEach(() => {
    localStorage.removeItem(TOP_SCORE_KEY)
  })

  it('returns "0" by default', () => {
    expect(getTopScore()).toBe(String(0))
  })

  const numberValues = [1, 100]

  numberValues.forEach((value) => {
    it(`returns previously set Number "${value}"`, () => {
      setTopScore(String(value))
      expect(getTopScore()).toBe(String(value))
    })
  })

  const nonNumberValues = [null, 'NaN', NaN, Infinity, 'abc']
  nonNumberValues.forEach((value) => {
    it(`returns "0" instead of non-Number "${value}"`, () => {
      setTopScore(String(value))
      expect(getTopScore()).toBe('0')
    })
  })
})
