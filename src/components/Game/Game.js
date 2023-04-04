// @flow
import * as React from 'react'
import {NumericInput} from 'numeric-keyboard/dist/numeric_keyboard.react'

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
export const GameScene = (props: Props): React.Node => {
  function onInput(value: string) {
    if (props.inputRef.current) {
      props.inputRef.current.value = value
    }
  }

  return (
    <>
      <div className="scores">
        <div className="seconds">
          {':'}
          {props.secondsLeft}
        </div>
        <div className="score">{props.score}</div>
        <div className="hearts">{(new Array(props.hearts): Array<string>).fill('❤️')}</div>
      </div>
      <Task left={props.left} right={props.right} />
      <input
        className="userInput"
        type="text"
        inputMode="decimal"
        ref={props.inputRef}
        required={true}
        max={100}
        pattern={'[0-9]*'}
      />
      <NumericInput
        autofocus={true}
        layout="tel"
        placeholder=""
        onInput={onInput}
        onEnterpress={props.onSubmitTask}
      />
      <PreviousTask left={props.prevLeft} right={props.prevRight} />
      {props.showEmoji ? (
        <div className="emoji" ref={props.emojiRef} onAnimationEnd={props.onAnimationEnd}>
          <span role="img">{props.isLove ? CORRECT_ANSWER_EMOJI : INCORRECT_ANSWER_EMOJI}</span>
        </div>
      ) : null}
    </>
  )
}

type State = {|
  secondsLeft: number,
|}
class StatefulGameScene extends React.Component<ExternalProps, State> {
  state: State = {secondsLeft: 5}

  componentDidMount: () => void = () => {
    this.scheduleSecondsUpdate()
  }
  componentWillUnmount: () => void = () => {
    if (this.secondsTimeoutId) {
      clearTimeout(this.secondsTimeoutId)
    }
  }

  secondsTimeoutId: ?TimeoutID = null

  scheduleSecondsUpdate: () => void = () => {
    this.secondsTimeoutId = setTimeout(this.updateSeconds, SECOND_IN_MS)
  }

  updateSeconds: () => void = () => {
    this.setState(
      {
        secondsLeft: this.state.secondsLeft - 1,
      },
      this.scheduleSecondsUpdate,
    )
  }

  render(): React.Element<typeof GameScene> {
    return <GameScene secondsLeft={this.state.secondsLeft} {...this.props} />
  }
}

export default StatefulGameScene
