import React from 'react'
import {shallow} from 'enzyme'

import {GameScene, Scores} from '../components/Game/Game'
import Task from '../components/Task/Task'
import PreviousTask from '../components/PreviousTask/PreviousTask'

it('renders without crashing', () => {
  const element = shallow(<GameScene />)
  expect(element.find(Scores).length).toBe(1)
  expect(element.find('.seconds').length).toBe(1)
  expect(element.find('.score').length).toBe(1)
  expect(element.find('.hearts').length).toBe(1)
  expect(element.find('form').length).toBe(1)
  expect(element.find(Task).length).toBe(1)
  expect(element.find(PreviousTask).length).toBe(1)
  expect(element.find('.userInput').length).toBe(1)
  expect(element.find('.submitButton').length).toBe(1)
})
