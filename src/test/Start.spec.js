import React from 'react'
import {shallow} from 'enzyme'

import StartScene from '../components/Start/Start'

it('renders without crashing', () => {
  const element = shallow(<StartScene />)
  expect(element.find('.startScene').length).toBe(1)
  expect(element.find('.startButton').length).toBe(1)
  expect(element.find('.topScore').length).toBe(0)
})

it('renders propvided topscore', () => {
  const topScore = '123'
  const element = shallow(<StartScene topScore={topScore} />)
  expect(element.find('.topScore').text()).toContain(topScore)
})

it('skips incorrect topscore', () => {
  const topScore = 'NaN'
  const element = shallow(<StartScene topScore={topScore} />)
  expect(element.find('.topScore').length).toBe(0)
})
