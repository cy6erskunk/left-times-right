import { render, screen } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'

import StartScene from '../components/Start/Start'

test('renders without crashing', () => {
  render(<StartScene />)
  expect(screen.getByRole('group')).toBeInTheDocument()
  expect(screen.getByRole('button')).toBeInTheDocument()
  expect(screen.queryByRole('img')).not.toBeInTheDocument()
})

test('renders propvided topscore', () => {
  const topScore = '123'
  render(<StartScene topScore={topScore} />)
  expect(screen.queryAllByRole('img')[0].parentNode).toHaveTextContent(topScore)
})

test('skips incorrect topscore', () => {
  const topScore = 'NaN'
  render(<StartScene topScore={topScore} />)
  expect(screen.queryByRole('img')).not.toBeInTheDocument()
})
