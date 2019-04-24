import React from 'react'
import {shallow} from 'enzyme'

import {INITIAL_SCORE, INITIAL_HEARTS} from '../../constants'

import App, {scenes} from './App'

const {START, GAME, END} = scenes

it('renders without crashing', () => {
  const element = shallow(<App />)
  expect(element.find('.App').length).toBe(1)
})

it('is initialized correctly', () => {
  const element = shallow(<App />)

  expect(element.state('hearts')).toBe(null)

  expect(element.find(START).length).toBe(1)
  expect(element.find(GAME).length).toBe(0)
  expect(element.find(END).length).toBe(0)
})

it('sets main scene correctly', () => {
  const element = shallow(<App />)
  element.find(START).prop('onClick')()

  expect(element.state('score')).toBe(INITIAL_SCORE)
  expect(element.state('hearts')).toBe(INITIAL_HEARTS)

  expect(element.find(START).length).toBe(0)
  expect(element.find(GAME).length).toBe(1)
  expect(element.find(END).length).toBe(0)

  const GameElement = element.find(GAME).shallow()

  expect(GameElement.find('.score').length).toBe(1)
  expect(GameElement.find('form').length).toBe(1)
  expect(GameElement.find('.userInput').length).toBe(1)
  expect(GameElement.find('.submitButton').length).toBe(1)
  expect(GameElement.find('.prevTask').length).toBe(0)
})

it('renders outro when lives are gone', () => {
  const element = shallow(<App />)
  element.setState({hearts: 0})

  expect(element.find(START).length).toBe(0)
  expect(element.find(GAME).length).toBe(0)
  expect(element.find(END).length).toBe(1)
})

it('renders prev task when prev values are set', () => {
  const element = shallow(<App />)

  element.setState({
    prevLeft: 0,
    prevRight: 0,
  })
})
