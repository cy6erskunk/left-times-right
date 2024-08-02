import * as React from 'react';

const EndScene = (
  {
    score = 0,
    onClick,
  }: {
    score: number,
    onClick: () => void
  },
): React.ReactElement => <div className={'endScene'}>
  <div className={'gameOver'}>{'GAME OVER'}</div>
  <div className={'finalScore'} aria-label="final score">
    {'Score: '}
    {score}
  </div>
  <button className={'restartButton'} aria-label="restart" onClick={onClick}>
    {'RE-START'}
  </button>
</div>

export default EndScene
