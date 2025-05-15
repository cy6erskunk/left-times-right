import * as React from 'react'

const EndScene = ({
  score = 0,
  onClick,
  gamesWon,
}: {
  score: number
  onClick: () => void
  gamesWon: number
}): React.ReactElement => (
  <div className={'endScene'}>
    <div className={'gameOver'}>{'GAME OVER'}</div>
    <div className={'finalScore'} aria-label="final score">
      {'Score: '}
      {score}
    </div>
    <p>Games Won: {gamesWon}</p>
    <button className={'restartButton'} aria-label="restart" onClick={onClick}>
      {'RE-START'}
    </button>
  </div>
)

export default EndScene
