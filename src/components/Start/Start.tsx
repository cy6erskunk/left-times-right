import React from 'react'

const CROWN = '👑'

interface StartSceneProps {
  onClick: () => void
  topScore: string
  gamesWon: number
}


const StartScene: React.FC<StartSceneProps> = ({ onClick, topScore, gamesWon }) => (
  <div className={'startScene'} role="group" aria-label="start">
    <button onClick={onClick} className={'startButton'}>
      {'START'}
    </button>
    {topScore && Number(topScore) > 0 ? (
      <div className={'topScore'}>
        <span role={'img'}>{CROWN}</span>
        {topScore}
        <span role={'img'}>{CROWN}</span>
      </div>
    ) : null}
    {gamesWon && Number(gamesWon) >= 0 ? (
      <div className={'topScore'}>
        <span role={'img'}>{CROWN + CROWN + CROWN}</span>
        {gamesWon}
        <span role={'img'}>{CROWN + CROWN + CROWN}</span>
      </div>
    ) : null}
  </div>
)

export default StartScene
