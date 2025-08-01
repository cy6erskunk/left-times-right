import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import {
  CORRECT_ANSWER_EMOJI,
  GAME_TIMEOUT_IN_MS,
  INCORRECT_ANSWER_EMOJI,
  SECOND_IN_MS,
} from '../../constants'
import { NumericInput } from '../../numeric-keyboard/index'
import PreviousTask from '../PreviousTask/PreviousTask'
import Task from '../Task/Task'

type ExternalProps = {
  score: number
  hearts: number
  left: number
  right: number
  prevLeft: number
  prevRight: number
  onSubmitTask: () => void
  onFocus: () => void
  onAnimationEnd: () => void
  inputRef: React.RefObject<HTMLInputElement | null>
  emojiRef: React.RefObject<HTMLDivElement | null>
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
        <div
          className="emoji"
          ref={props.emojiRef}
          onAnimationEnd={props.onAnimationEnd}
        >
          <span role="img">
            {props.isLove ? CORRECT_ANSWER_EMOJI : INCORRECT_ANSWER_EMOJI}
          </span>
        </div>
      ) : null}
    </>
  )
}

function StatefulGameScene(
  props: ExternalProps,
): React.ReactElement<React.ComponentProps<typeof GameScene>> {
  const [secondsLeft, setSecondsLeft] = useState<number>(
    GAME_TIMEOUT_IN_MS / SECOND_IN_MS,
  )
  const secondsTimeoutIdRef = useRef<number | null>(null)

  const updateSeconds = () => {
    setSecondsLeft((prevSeconds) => prevSeconds - 1)
    scheduleSecondsUpdate()
  }

  const scheduleSecondsUpdate = () => {
    secondsTimeoutIdRef.current = window.setTimeout(updateSeconds, SECOND_IN_MS)
  }

  useEffect(() => {
    scheduleSecondsUpdate()

    return () => {
      if (secondsTimeoutIdRef.current) {
        clearTimeout(secondsTimeoutIdRef.current)
      }
    }
  }, [])

  return <GameScene secondsLeft={secondsLeft} {...props} />
}

export default StatefulGameScene
