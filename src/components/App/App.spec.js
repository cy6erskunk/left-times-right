import React from 'react'
import {shallow} from 'enzyme'

import App from './App'

it('renders without crashing', () => {
  shallow(<App />)
})

it('renders children correctly', () => {
  const element = shallow(<App />)

  expect(element.find('.App').length).toBe(1)
  expect(element.find('.score').length).toBe(1)
  expect(element.find('form').length).toBe(1)
  expect(element.find('.userInput').length).toBe(1)
  expect(element.find('.submitButton').length).toBe(1)
  expect(element.find('.prevTask').length).toBe(0)
})

it('renders prev task when prev values are set', () => {
  const element = shallow(<App />)

  element.setState({
    prevLeft: 0,
    prevRight: 0,
  })
})
