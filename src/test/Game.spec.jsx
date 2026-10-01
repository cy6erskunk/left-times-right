import { render, screen } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'

import { GameScene } from '../components/Game/Game'

test('renders without crashing', () => {
  render(<GameScene left={0} right={0} />)
  expect(screen.getByRole('group', { name: 'scores' })).toBeInTheDocument()
  expect(screen.getByRole('timer')).toBeInTheDocument()
  expect(screen.getByLabelText('score')).toBeInTheDocument()
  expect(screen.getByLabelText('lives')).toBeInTheDocument()
  expect(screen.getByLabelText('current task')).toBeInTheDocument()
  expect(screen.queryByLabelText('previous task')).not.toBeInTheDocument()
  expect(screen.queryByRole('textbox')).toBeInTheDocument()
})
