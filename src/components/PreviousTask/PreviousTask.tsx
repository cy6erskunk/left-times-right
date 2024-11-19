import * as React from 'react'

import { EQUALS_SIGN, MILTIPLY_SIGN } from '../../constants'

type Props = {
  left: number
  right: number
}

export const PreviousTaskInner = ({
  left,
  right,
}: Props): React.ReactElement<React.ComponentProps<'div'>> | null =>
  left > Number.MIN_SAFE_INTEGER && right > Number.MIN_SAFE_INTEGER ? (
    <div className="prevTask" role="group" aria-label="previous task">
      <span>{left}</span>
      <span>{MILTIPLY_SIGN}</span>
      <span>{right}</span>
      <span>{EQUALS_SIGN}</span>
      <span>{left * right}</span>
    </div>
  ) : null

const Memoized: React.ComponentType<Props> = React.memo(PreviousTaskInner)
export default Memoized
