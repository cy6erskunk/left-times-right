// @flow
import * as React from 'react'

const EndScene = ({score = 0, onClick}: {|score: number, onClick: () => void|}) => (
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
