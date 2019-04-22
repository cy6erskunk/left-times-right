// @flow
import * as React from 'react'

import {INITIAL_SCORE, INITIAL_HEARTS} from '../../constants'
import {generateDigit} from '../../helpers'
import Task from '../Task/Task'
import PreviousTask from '../PreviousTask/PreviousTask'

export const StartScene = (props: {|onClick: () => void|}) => (
  <button onClick={props.onClick}>{'START'}</button>
)

export const GameScene = (props: {|
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
        <span role="img">{props.isLove ? '❤️' : '💩'}</span>
      </div>
    ) : null}
  </>
)

export const EndScene = ({score, onClick}: {|score: number, onClick: () => void|}) => (
  <>
    <div>{score}</div>
    <button onClick={onClick}>{'RE-START'}</button>
  </>
)

export const scenes = {
  START: StartScene,
  GAME: GameScene,
  END: EndScene,
}

type Props = {||}
type State = {|
  left: number,
  right: number,
  prevLeft: number,
  prevRight: number,
  score: number,
  showEmoji: boolean,
  isLove: boolean,
  hearts: ?number,
  scene: $Values<typeof scenes>,
|}

type ReactObjRef<ElementType: React.ElementType> = {current: null | React.ElementRef<ElementType>}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.inputRef = React.createRef()
    this.emojiRef = React.createRef()

    if (localStorage.getItem('score') === null) {
      localStorage.setItem('score', String(INITIAL_SCORE))
    }

    this.state = {
      left: generateDigit(),
      right: generateDigit(),
      prevLeft: -Infinity,
      prevRight: -Infinity,
      score: parseInt(localStorage.getItem('score'), 10),
      showEmoji: false,
      isLove: true,
      hearts: null,
      scene: scenes.START,
    }
  }

  componentDidMount() {
    this.resetInput()
  }

  inputRef: ReactObjRef<'input'>
  emojiRef: ReactObjRef<'div'>

  goToGame = () => {
    this.setState({
      scene: scenes.GAME,
      hearts: 3,
      score: 0,
      showEmoji: false,
    })
  }

  generateTask = () =>
    this.setState(
      state => ({
        left: generateDigit(),
        right: generateDigit(),
        prevLeft: state.left,
        prevRight: state.right,
      }),
      this.updateScore,
    )

  updateScore = () =>
    this.setState(state => {
      const isLove =
        state.prevLeft * state.prevRight ===
        parseInt(this.inputRef.current && this.inputRef.current.value, 10)
      const newScore = isLove ? state.score + 1 : state.score
      localStorage.setItem('score', String(newScore))
      if (state.hearts && state.hearts > 0) {
        const newHearts = isLove ? state.hearts : state.hearts - 1
        return {
          score: newScore,
          hearts: newHearts,
          showEmoji: true,
          isLove,
        }
      } else {
        return {
          scene: scenes.END,
          hearts: 0,
          score: newScore,
        }
      }
    }, this.resetInput)

  resetInput = () => {
    if (this.inputRef && this.inputRef.current) {
      this.inputRef.current.value = ''
      this.inputRef.current.focus()
    }
  }

  onFocus = () => {
    window.scrollTo(0, 0)
    if (document.body) {
      document.body.scrollTop = 0
    }
  }

  onSubmitTask = (e: Event) => {
    e.preventDefault()
    if (this.inputRef && this.inputRef.current && this.inputRef.current.checkValidity()) {
      this.generateTask()
    }
  }

  onAnimationEnd = () => {
    if (this.emojiRef && this.emojiRef.current) {
      this.emojiRef.current.removeEventListener('animationend', this.onAnimationEnd)
    }
    this.setState({
      showEmoji: false,
    })
  }

  render() {
    const {left, right, prevLeft, prevRight, score, showEmoji, isLove, hearts} = this.state
    const Component = this.state.scene
    return (
      <div className="App">
        <React.StrictMode>
          <Component
            left={left}
            right={right}
            prevLeft={prevLeft}
            prevRight={prevRight}
            score={score}
            showEmoji={showEmoji}
            isLove={isLove}
            hearts={hearts || INITIAL_HEARTS}
            inputRef={this.inputRef}
            emojiRef={this.emojiRef}
            onAnimationEnd={this.onAnimationEnd}
            onSubmitTask={this.onSubmitTask}
            onFocus={this.onFocus}
            onClick={this.goToGame}
          />
          )}
        </React.StrictMode>
      </div>
    )
  }
}

export default App
