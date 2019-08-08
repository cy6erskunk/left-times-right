// @flow
import * as React from 'react'

import {CORRECT_ANSWER_EMOJI, INCORRECT_ANSWER_EMOJI, SECOND_IN_MS} from '../../constants'
import Task from '../Task/Task'
import PreviousTask from '../PreviousTask/PreviousTask'

type ReactObjRef<ElementType: React.ElementType> = {current: null | React.ElementRef<ElementType>}

type ExternalProps = {|
  score: number,
  hearts: number,
  left: number,
  right: number,
  prevLeft: number,
  prevRight: number,
  onSubmitTask: (e: Event) => void,
  onFocus: () => void,
  onAnimationEnd: () => void,
  inputRef: ReactObjRef<'input'>,
  emojiRef: React.Ref<'div'>,
  showEmoji: boolean,
  isLove: boolean,
|}

type Props = {|...ExternalProps, secondsLeft: number|}
export const GameScene = (props: Props) => (
  <>
    <div className="scores">
      <div className="seconds">
        {':'}
        {props.secondsLeft}
      </div>
      <div className="score">{props.score}</div>
      <div className="hearts">{new Array(props.hearts).fill('❤️')}</div>
    </div>
    <form onSubmit={props.onSubmitTask}>
      <Task left={props.left} right={props.right} />
      <input
        onFocus={props.onFocus}
        className="userInput"
        type="number"
        ref={props.inputRef}
        required={true}
        max={100}
        pattern={'[0-9]*'}
      />
      <button className={'submitButton'}>{'GO!'}</button>
    </form>
    <PreviousTask left={props.prevLeft} right={props.prevRight} />
    {props.showEmoji ? (
      <div className="emoji" ref={props.emojiRef} onAnimationEnd={props.onAnimationEnd}>
        <span role="img">{props.isLove ? CORRECT_ANSWER_EMOJI : INCORRECT_ANSWER_EMOJI}</span>
      </div>
    ) : null}
  </>
)

type State = {|
  secondsLeft: number,
|}
class StatefulGameScene extends React.Component<ExternalProps, State> {
  state = {secondsLeft: 5}

  componentDidMount = () => {
    if (this.props.inputRef && this.props.inputRef.current) {
      this.props.inputRef.current.focus()
    }
    this.scheduleSecondsUpdate()
  }
  componentWillUnmount = () => {
    if (this.secondsTimeoutId) {
      clearTimeout(this.secondsTimeoutId)
    }
  }

  secondsTimeoutId: ?TimeoutID = null

  scheduleSecondsUpdate = () => {
    this.secondsTimeoutId = setTimeout(this.updateSeconds, SECOND_IN_MS)
  }

  updateSeconds = () => {
    this.setState(
      {
        secondsLeft: this.state.secondsLeft - 1,
      },
      this.scheduleSecondsUpdate,
    )
  }

  render() {
    return <GameScene secondsLeft={this.state.secondsLeft} {...this.props} />
  }
}

export default StatefulGameScene
