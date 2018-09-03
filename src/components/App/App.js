// @flow
import * as React from 'react'

import {INITIAL_SCORE, MILTIPLY_SIGN, EQUALS_SIGN} from '../../constants'
import {generateDigit} from '../../helpers'
import Task from '../Task/Task'

type Props = {||}
type State = {|
  left: number,
  right: number,
  prevLeft: number,
  prevRight: number,
  score: number,
  showEmoji: boolean,
  isLove: boolean,
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
    }
  }

  componentDidMount() {
    this.resetInput()
  }

  inputRef: ReactObjRef<'input'>
  emojiRef: ReactObjRef<'div'>

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
      const newScore = isLove ? state.score + 1 : state.score - 1
      localStorage.setItem('score', String(newScore))
      return {
        score: newScore,
        showEmoji: true,
        isLove,
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
    return (
      <div className="App">
        <div className="score">{this.state.score}</div>
        <form onSubmit={this.onSubmitTask}>
          <Task left={this.state.left} right={this.state.right} />
          <input
            onFocus={this.onFocus}
            className="userInput"
            type="number"
            ref={this.inputRef}
            required={true}
            max={100}
            pattern={'[0-9]*'}
          />
          <button className={'submitButton'}>{'GO!'}</button>
        </form>
        {this.state.prevLeft > Number.MIN_SAFE_INTEGER &&
        this.state.prevRight > Number.MIN_SAFE_INTEGER ? (
          <div className="prevTask">
            <span>{this.state.prevLeft}</span>
            <span>{MILTIPLY_SIGN}</span>
            <span>{this.state.prevRight}</span>
            <span>{EQUALS_SIGN}</span>
            <span>{this.state.prevLeft * this.state.prevRight}</span>
          </div>
        ) : null}
        {this.state.showEmoji ? (
          <div className="emoji" ref={this.emojiRef} onAnimationEnd={this.onAnimationEnd}>
            <span role="img">{this.state.isLove ? '❤️' : '💩'}</span>
          </div>
        ) : null}
      </div>
    )
  }
}

export default App
