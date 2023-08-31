import React from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'

import {TaskInner as Task} from '../components/Task/Task'
import {MILTIPLY_SIGN} from '../constants'

test('renders without crashing when valid arguments are provided', () => {
  render(<Task left={0} right={0} />)
  expect(screen.getByRole('group')).toHaveTextContent(MILTIPLY_SIGN)
})

test('throws when not valid arguments are provided', () => {
  expect(() => {
    render(<Task left={0} right={'s'} />)
  }).toThrow('Invalid arguments')
})

test('renders left and right values', () => {
  const left = 0
  const right = 1
  render(<Task left={left} right={right} />)

  expect(screen.getByRole('group').textContent).toContain(String(left))
  expect(screen.getByRole('group').textContent).toContain(String(right))
})
