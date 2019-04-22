import React from 'react'
import {shallow} from 'enzyme'

import {INITIAL_SCORE, INITIAL_HEARTS} from '../../constants'

import App, {StartScene, GameScene, scenes} from './App'

const {START, GAME} = scenes

it('renders without crashing', () => {
  shallow(<App />)
})

it('is initialized correctly', () => {
  const element = shallow(<App />)

  expect(element.state('hearts')).toBe(null)
  expect(element.state('scene')).toBe(START)

  expect(element.find('.App').length).toBe(1)
  expect(element.find(StartScene).length).toBe(1)
  expect(element.find(GameScene).length).toBe(0)
})

it('sets main scene correctly', () => {
  const element = shallow(<App />)
  element.find(START).prop('onClick')()

  expect(element.state('scene')).toBe(GAME)
  expect(element.state('score')).toBe(INITIAL_SCORE)
  expect(element.state('hearts')).toBe(INITIAL_HEARTS)

  expect(element.find(StartScene).length).toBe(0)
  expect(element.find(GameScene).length).toBe(1)

  expect(element.find('.App').length).toBe(1)

  const GameElement = element.find(GameScene).shallow()

  expect(GameElement.find('.score').length).toBe(1)
  expect(GameElement.find('form').length).toBe(1)
  expect(GameElement.find('.userInput').length).toBe(1)
  expect(GameElement.find('.submitButton').length).toBe(1)
  expect(GameElement.find('.prevTask').length).toBe(0)
})

it('renders prev task when prev values are set', () => {
  const element = shallow(<App />)

  element.setState({
    prevLeft: 0,
    prevRight: 0,
  })
})
