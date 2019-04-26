import React from 'react'
import {shallow} from 'enzyme'

import GameScene from '../components/Game/Game'
import Task from '../components/Task/Task'
import PreviousTask from '../components/PreviousTask/PreviousTask'

it('renders without crashing', () => {
  const element = shallow(<GameScene />)
  expect(element.find('.scores').length).toBe(1)
  expect(element.find('form').length).toBe(1)
  expect(element.find(Task).length).toBe(1)
  expect(element.find(PreviousTask).length).toBe(1)
})
