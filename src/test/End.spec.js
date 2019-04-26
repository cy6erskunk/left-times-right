import React from 'react'
import {shallow} from 'enzyme'

import EndScene from '../components/End/End'

it('renders without crashing', () => {
  const element = shallow(<EndScene />)
  expect(element.find('.endScene').length).toBe(1)
  expect(element.find('.restartButton').length).toBe(1)
  expect(element.find('.finalScore').length).toBe(1)
  expect(element.find('.finalScore').text()).toContain('0')
})

it('renders provided score', () => {
  const score = 123
  const element = shallow(<EndScene score={score} />)
  expect(element.find('.finalScore').text()).toContain(score)
})
