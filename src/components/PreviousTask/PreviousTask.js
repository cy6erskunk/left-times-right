// @flow
import React from 'react'

import {MILTIPLY_SIGN, EQUALS_SIGN} from '../../constants'

type Props = {
  left?: number,
  right?: number,
}

const PreviousTask = ({left, right}: Props) =>
  left > Number.MIN_SAFE_INTEGER && right > Number.MIN_SAFE_INTEGER ? (
    <div className="prevTask">
      <span>{left}</span>
      <span>{MILTIPLY_SIGN}</span>
      <span>{right}</span>
      <span>{EQUALS_SIGN}</span>
      <span>{left * right}</span>
    </div>
  ) : null

export default PreviousTask
