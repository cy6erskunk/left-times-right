// @flow
import * as React from 'react'

import {CORRECT_ANSWER_EMOJI, INCORRECT_ANSWER_EMOJI} from '../../constants'
import Task from '../Task/Task'
import PreviousTask from '../PreviousTask/PreviousTask'

const GameScene = (props: {|
  score: number,
  hearts: number,
  left: number,
  right: number,
  prevLeft: number,
  prevRight: number,
  onSubmitTask: (e: Event) => void,
  onFocus: () => void,
  onAnimationEnd: () => void,
  inputRef: React.Ref<'input'>,
  emojiRef: React.Ref<'div'>,
  showEmoji: boolean,
  isLove: boolean,
|}) => (
  <>
    <div className="scores">
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

export default GameScene
