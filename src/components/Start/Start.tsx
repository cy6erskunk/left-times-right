import * as React from 'react';

const CROWN = '👑'

type StartSceneProps = {
  onClick: () => void,
  topScore: string | null | undefined
};

const StartScene = (props: StartSceneProps): React.ReactElement<React.ComponentProps<'div'>> => <div className={'startScene'} role="group" aria-label="start">
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

export default StartScene
