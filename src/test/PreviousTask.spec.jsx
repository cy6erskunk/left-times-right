import { render, screen } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import { PreviousTaskInner as PreviousTask } from '../components/PreviousTask/PreviousTask'

it('renders nothing if left prop is absent', () => {
  render(<PreviousTask right={1} />)
  expect(screen.queryByRole('group')).not.toBeInTheDocument()
})

test('renders nothing if right prop is absent', () => {
  render(<PreviousTask left={1} />)
  expect(screen.queryByRole('group')).not.toBeInTheDocument()
})

test('renders correctly', () => {
  const left = 111
  const right = 999
  render(<PreviousTask left={left} right={right} />)
  expect(screen.getByRole('group').textContent).toContain(String(left))
  expect(screen.getByRole('group').textContent).toContain(String(right))
  expect(screen.getByRole('group').textContent).toContain(String(left * right))
})
