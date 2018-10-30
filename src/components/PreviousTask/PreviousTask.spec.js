import React from 'react'
import {shallow} from 'enzyme'

import {PreviousTaskInner as PreviousTask} from './PreviousTask'

it('renders nothing if left prop is absent', () => {
  const element = shallow(<PreviousTask right={1} />)
  expect(element.html()).toBe(null)
})

it('renders nothing if right prop is absent', () => {
  const element = shallow(<PreviousTask left={1} />)
  expect(element.html()).toBe(null)
})

it('renders correctly', () => {
  const left = 111
  const right = 999
  const element = shallow(<PreviousTask left={left} right={right} />)
  expect(element.html()).toContain(left)
  expect(element.html()).toContain(right)
  expect(element.html()).toContain(left * right)
})
