import React from 'react'
import ReactDOM from 'react-dom'

import './styles.css'

const MILTIPLY_SIGN = 'x'
const EQUALS_SIGN = '='
const generateDigit = () => Math.floor(Math.random() * 9) + 2
const Task = props => (
  <div className="task">
    <span className="number">{props.left}</span>
    <span>{MILTIPLY_SIGN}</span>
    <span className="number">{props.right}</span>
  </div>
)

class App extends React.Component {
  constructor(props) {
    super(props)

    this.inputRef = React.createRef()
    this.emojiRef = React.createRef()

    if (localStorage.getItem('score') === null) {
      localStorage.setItem('score', 0)
    }

    this.state = {
      left: generateDigit(),
      right: generateDigit(),
      score: parseInt(localStorage.getItem('score'), 10),
      showEmoji: false,
      isLove: true
    }
  }

  componentDidMount() {
    this.resetInput()
  }

  generateTask = () =>
    this.setState(
      state => ({
        left: generateDigit(),
        right: generateDigit(),
        prevLeft: state.left,
        prevRight: state.right
      }),
      this.updateScore
    )

  updateScore = () =>
    this.setState(state => {
      const isLove = state.prevLeft * state.prevRight === parseInt(this.inputRef.current.value, 10);
      const newScore = isLove 
          ? state.score + 1
          : state.score - 1
      localStorage.setItem('score', newScore)
      return {
        score: newScore,
        showEmoji: true,
        isLove
      }
    }, this.resetInput)

  resetInput = () => {
    this.inputRef.current.value = ''
    
    this.inputRef.current.focus()
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    })
  }

  onSubmitTask = e => {
    e.preventDefault()
    if (this.inputRef.current.checkValidity()) {
      this.generateTask()
    }
  }

  onAnimationEnd = () => {
    this.emojiRef.current.removeEventListener('animationend', this.onAnimationEnd);
    this.setState({
      showEmoji: false
    })
  }

  render() {
    return (
      <div className="App">
        <div className="score">{this.state.score}</div>
        <form onSubmit={e => this.onSubmitTask(e)}>
          <Task left={this.state.left} right={this.state.right} />
          <input
            className="userInput"
            type="number"
            ref={this.inputRef}
            required
            max={100}
            pattern={'[0-9]*'}
          />
          <button className={'submitButton'}>{'GO!'}</button>
        </form>
        {typeof this.state.prevLeft !== 'undefined' &&
        typeof this.state.prevRight !== 'undefined' ? (
          <div>
            <span>{this.state.prevLeft}</span>
            <span>{MILTIPLY_SIGN}</span>
            <span>{this.state.prevRight}</span>
            <span>{EQUALS_SIGN}</span>
            <span>{this.state.prevLeft * this.state.prevRight}</span>
          </div>
        ) : null}
        {
          this.state.showEmoji
            ? (
              <div class="emoji" ref={this.emojiRef} onAnimationEnd={this.onAnimationEnd}>
                <span role="img">{this.state.isLove ? '❤️' : '💩'}</span>
              </div>)
            : null
        }
      </div>
    )
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
