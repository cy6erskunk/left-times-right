// @flow
import * as React from 'react'

type Props = {|score: number, onClick: () => void|}

const EndScene = ({score = 0, onClick}: Props) => (
  <div className={'endScene'}>
    <div className={'gameOver'}>{'GAME OVER'}</div>
    <div className={'finalScore'}>
      {'Score: '}
      {score}
    </div>
    <button className={'restartButton'} onClick={onClick}>
      {'RE-START'}
    </button>
  </div>
)

export default EndScene
