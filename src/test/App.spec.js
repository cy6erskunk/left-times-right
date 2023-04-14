import React from 'react'
import {render, screen} from '@testing-library/react'

import {INITIAL_SCORE, INITIAL_HEARTS, TOP_SCORE_KEY} from '../constants'
import App, {scenes, getTopScore, setTopScore} from '../components/App/App'

const {START, GAME, END} = scenes

it('renders without crashing', async () => {
  render(<App />)
  expect(await screen.getByRole('main')).toBeDefined()
})

it.only('is initialized correctly', async () => {
  render(<App />)

  // expect(element.state('hearts')).toBe(null)

  expect(await screen.getByRole('button', {title: 'Start'})).toBeDefined()
  // expect(element.find(GAME).length).toBe(0)
  // expect(element.find(END).length).toBe(0)
})

it('sets main scene correctly', () => {
  render(<App />)
  element.find(START).prop('onClick')()

  expect(element.state('score')).toBe(INITIAL_SCORE)
  expect(element.state('hearts')).toBe(INITIAL_HEARTS)

  expect(element.find(START).length).toBe(0)
  expect(element.find(GAME).length).toBe(1)
  expect(element.find(END).length).toBe(0)
})

it('renders outro when lives are gone', () => {
  render(<App />)
  element.setState({hearts: 0})

  expect(element.find(START).length).toBe(0)
  expect(element.find(GAME).length).toBe(0)
  expect(element.find(END).length).toBe(1)
})

it('renders prev task when prev values are set', () => {
  render(<App />)

  element.setState({
    prevLeft: 0,
    prevRight: 0,
  })
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
