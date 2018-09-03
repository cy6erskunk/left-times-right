// @flow
import * as React from 'react'
import ReactDOM from 'react-dom'

import './styles.css'

const MILTIPLY_SIGN = 'x'
const EQUALS_SIGN = '='
const MIN_NUMBER = 2
const MAX_NUMBER = 9
const INITIAL_SCORE = 0
const generateDigit = () => Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER
const Task = props => (
  <div className="task">
    <span className="number">{props.left}</span>
    <span>{MILTIPLY_SIGN}</span>
    <span className="number">{props.right}</span>
  </div>
)
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

export default class App extends React.Component<Props, State> {
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
        {this.state.prevLeft > Number.MIN_VALUE && this.state.prevRight > Number.MIN_VALUE ? (
          <div>
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

const rootElement = document.getElementById('root')
if (rootElement) {
  ReactDOM.render(<App />, rootElement)
}
