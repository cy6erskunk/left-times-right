import * as React from 'react'

import { MILTIPLY_SIGN } from '../../constants'

type Props = {
  left: number
  right: number
}

export const TaskInner = ({
  left,
  right,
}: Props): React.ReactElement<React.ComponentProps<'div'>> => {
  if (typeof left !== 'number' || typeof right !== 'number') {
    throw new Error('Invalid arguments')
  }

  return (
    <div className="task" role="group" aria-label="current task">
      <span className="number">{left}</span>
      <span>{MILTIPLY_SIGN}</span>
      <span className="number">{right}</span>
    </div>
  )
}

const Memoized: React.ComponentType<Props> = React.memo(TaskInner)
export default Memoized
