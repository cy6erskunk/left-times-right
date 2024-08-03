import * as React from 'react'
// @ts-ignore
import {NumericInput} from 'numeric-keyboard/dist/numeric_keyboard.react'

import {CORRECT_ANSWER_EMOJI, INCORRECT_ANSWER_EMOJI, SECOND_IN_MS} from '../../constants'
import Task from '../Task/Task'
import PreviousTask from '../PreviousTask/PreviousTask'

type ExternalProps = {
  score: number
  hearts: number
  left: number
  right: number
  prevLeft: number
  prevRight: number
  onSubmitTask: (e: Event) => void
  onFocus: () => void
  onAnimationEnd: () => void
  inputRef: React.RefObject<HTMLInputElement>
  emojiRef: React.RefObject<HTMLDivElement>
  showEmoji: boolean
  isLove: boolean
}

type Props = ExternalProps & {
  secondsLeft: number
}
export const GameScene = (props: Props): React.ReactElement => {
  function onInput(value: string) {
    if (props.inputRef.current) {
      props.inputRef.current.value = value
    }
  }

  return (
    <>
      <div className="scores" role="group" aria-label="scores">
        <div className="seconds" role="timer">
          {':'}
          {props.secondsLeft}
        </div>
        <div className="score" aria-label="score">
          {props.score}
        </div>
        <div className="hearts" aria-label="lives">
          {new Array<string>(props.hearts).fill('❤️')}
        </div>
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

type State = {
  secondsLeft: number
}
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

  secondsTimeoutId: number | null = null

  scheduleSecondsUpdate: () => void = () => {
    this.secondsTimeoutId = window.setTimeout(this.updateSeconds, SECOND_IN_MS)
  }

  updateSeconds: () => void = () => {
    this.setState(
      {
        secondsLeft: this.state.secondsLeft - 1,
      },
      this.scheduleSecondsUpdate,
    )
  }

  render(): React.ReactElement<React.ComponentProps<typeof GameScene>> {
    return <GameScene secondsLeft={this.state.secondsLeft} {...this.props} />
  }
}

export default StatefulGameScene
