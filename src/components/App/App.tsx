import * as React from 'react'
import { useEffect, useRef, useState } from 'react'

import {
  GAME_TIMEOUT_IN_MS,
  INITIAL_HEARTS,
  INITIAL_SCORE,
  TOP_SCORE_KEY,
} from '../../constants'
import { generateDigit } from '../../helpers'
import { KeyboardManager } from '../../numeric-keyboard/input'
import EndScene from '../End/End'
import GameScene from '../Game/Game'
import StartScene from '../Start/Start'

export function getTopScore(): string {
  const value = localStorage.getItem(TOP_SCORE_KEY)
  return value && value !== 'NaN' ? value : '0'
}

export function setTopScore(topScore: string): void {
  return localStorage.setItem(
    TOP_SCORE_KEY,
    String(Math.max(parseInt(topScore, 10), parseInt(getTopScore(), 10))),
  )
}

export const scenes = {
  START: StartScene,
  GAME: GameScene,
  END: EndScene,
} as const

function App() {
  const inputRef = useRef<HTMLInputElement>(null)
  const emojiRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<number | null>(null)

  if (localStorage.getItem('score') === null) {
    localStorage.setItem('score', String(INITIAL_SCORE))
  }

  const [left, setLeft] = useState(generateDigit())
  const [right, setRight] = useState(generateDigit())
  const [prevLeft, setPrevLeft] = useState(-Infinity)
  const [prevRight, setPrevRight] = useState(-Infinity)
  const [score, setScore] = useState(
    parseInt(localStorage.getItem('score') || '0', 10),
  )
  const [showEmoji, setShowEmoji] = useState(false)
  const [isLove, setIsLove] = useState(true)
  const [hearts, setHearts] = useState<number | null | undefined>(null)

  const goToGame = () => {
    // Clean up any existing keyboard before changing scenes
    KeyboardManager.cleanup()

    setHearts(3)
    setScore(0)
    setShowEmoji(false)
  }

  const getValue = (): number => parseInt(inputRef?.current?.value || '0', 10)

  const resetInput = (): void => {
    if (inputRef && inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const updateScore = (): void => {
    const newLeft = generateDigit()
    const newRight = generateDigit()
    setPrevLeft(left)
    setPrevRight(right)
    setLeft(newLeft)
    setRight(newRight)

    const currentValue = getValue()
    const isCurrentLove = left * right === currentValue

    const newScore = isCurrentLove ? score + 1 : score
    localStorage.setItem('score', String(newScore))
    setScore(newScore)

    const newHearts = hearts ? (isCurrentLove ? hearts : hearts - 1) : 0
    setHearts(newHearts)

    if (newHearts > 0) {
      setShowEmoji(true)
      setIsLove(isCurrentLove)
    } else {
      KeyboardManager.cleanup()
      setPrevLeft(-Infinity)
      setPrevRight(-Infinity)
      setTopScore(String(newScore))
      setShowEmoji(false)
      setIsLove(false)
    }

    resetInput()
  }

  const onFocus = (): void => {
    window.scrollTo(0, 0)
    if (document.body) {
      document.body.scrollTop = 0
    }
  }

  const onSubmitTask = (): void => {
    if (inputRef && inputRef.current && inputRef.current.checkValidity()) {
      updateScore()
    }
  }

  const onAnimationEnd = (): void => {
    if (emojiRef && emojiRef.current) {
      emojiRef.current.removeEventListener('animationend', onAnimationEnd)
    }
    setShowEmoji(false)
  }

  const renderGameScene = (): React.JSX.Element => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    timerRef.current = window.setTimeout(updateScore, GAME_TIMEOUT_IN_MS)

    return (
      <GameScene
        key={[left, right, score].join('-')}
        left={left}
        right={right}
        prevLeft={prevLeft}
        prevRight={prevRight}
        score={score}
        showEmoji={showEmoji}
        isLove={isLove}
        hearts={hearts || INITIAL_HEARTS}
        inputRef={inputRef}
        emojiRef={emojiRef}
        onAnimationEnd={onAnimationEnd}
        onSubmitTask={onSubmitTask}
        onFocus={onFocus}
      />
    )
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      KeyboardManager.cleanup()
    }
  }, [])

  return (
    <div className="App" role="main">
      <React.StrictMode>
        {hearts === null ? (
          <StartScene onClick={goToGame} topScore={getTopScore()} />
        ) : hearts != null && hearts > 0 ? (
          renderGameScene()
        ) : (
          <EndScene score={score} onClick={goToGame} />
        )}
      </React.StrictMode>
    </div>
  )
}

export default App
