// @flow
import * as React from 'react'

const CROWN = '👑'

type StartSceneProps = {|onClick: () => void, topScore: ?string|}

const StartScene = (props: StartSceneProps): React.Element<'div'> => (
  <div className={'startScene'} role="group">
    <button onClick={props.onClick} className={'startButton'}>
      {'START'}
    </button>
    {props.topScore && Number(props.topScore) > 0 ? (
      <div className={'topScore'}>
        <span role={'img'}>{CROWN}</span>
        {props.topScore}
        <span role={'img'}>{CROWN}</span>
      </div>
    ) : null}
  </div>
)

export default StartScene
