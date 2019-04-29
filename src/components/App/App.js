// @flow
import * as React from 'react'

import {INITIAL_SCORE, INITIAL_HEARTS, TOP_SCORE_KEY} from '../../constants'
import {generateDigit} from '../../helpers'
import StartScene from '../Start/Start'
import GameScene from '../Game/Game'
import EndScene from '../End/End'

export function getTopScore() {
  const value = localStorage.getItem(TOP_SCORE_KEY)
  return value && value !== 'NaN' ? value : '0'
}

export function setTopScore(topScore: string) {
  return localStorage.setItem(
    TOP_SCORE_KEY,
    String(Math.max(parseInt(topScore, 10), parseInt(getTopScore(), 10))),
  )
}

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
    }
  }

  componentDidMount() {
    this.resetInput()
  }

  inputRef: ReactObjRef<'input'>
  emojiRef: ReactObjRef<'div'>

  goToGame = () => {
    this.setState({
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
      const newHearts = state.hearts ? (isLove ? state.hearts : state.hearts - 1) : 0
      if (newHearts > 0) {
        return {
          score: newScore,
          hearts: newHearts,
          showEmoji: true,
          isLove,
        }
      } else {
        setTopScore(String(newScore))
        return {
          score: newScore,
          hearts: 0,
          showEmoji: false,
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
    return (
      <div className="App">
        <React.StrictMode>
          {hearts === null ? (
            <StartScene onClick={this.goToGame} topScore={getTopScore()} />
          ) : hearts != null && hearts > 0 ? (
            <GameScene
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
            />
          ) : (
            <EndScene score={score} onClick={this.goToGame} />
          )}
        </React.StrictMode>
      </div>
    )
  }
}

export default App
