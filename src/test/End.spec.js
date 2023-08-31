import React from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'

import EndScene from '../components/End/End'

test('renders without crashing', () => {
  const {container, getByRole, getByLabelText} = render(<EndScene />)
  expect(container.textContent).toContain('GAME OVER')
  expect(getByRole('button', {name: 'restart'})).toBeInTheDocument()
  expect(getByLabelText('final score')).toHaveTextContent('0')
})

test('renders provided score', () => {
  const score = 123
  render(<EndScene score={score} />)
  expect(screen.getByLabelText('final score')).toHaveTextContent(String(score))
})
