import React from 'react'
import {shallow} from 'enzyme'

import {TaskInner as Task} from '../components/Task/Task'

it('renders without crashing when valid arguments are provided', () => {
  shallow(<Task left={0} right={0} />)
})

it('throws when not valid arguments are provided', () => {
  expect(() => {
    shallow(<Task left={0} right={'s'} />)
  }).toThrow('Invalid arguments')
})

it('renders left and right values', () => {
  const left = 0
  const right = 1
  const element = shallow(<Task left={left} right={right} />)

  expect(element.find('.number').first().text()).toBe(String(left))
  expect(element.find('.number').last().text()).toBe(String(right))
})
