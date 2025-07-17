import * as React from 'react'
import { useEffect, useRef, useState } from 'react'

import {
  GAME_TIMEOUT_IN_MS,
  GAMES_WON_KEY,
  INITIAL_HEARTS,
  INITIAL_SCORE,
  TOP_SCORE_KEY,
} from '../../constants'
import { generateAllPairs, pickRandomPair } from '../../helpers'
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

  const [pairs, setPairs] = useState<[number, number][]>(generateAllPairs())
  const [currentPair, setCurrentPair] = useState<[number, number]>(() => {
    const all = generateAllPairs()
    return all[Math.floor(Math.random() * all.length)]
  })
  const [prevLeft, setPrevLeft] = useState(-Infinity)
  const [prevRight, setPrevRight] = useState(-Infinity)
  const [score, setScore] = useState(INITIAL_SCORE)
  const [showEmoji, setShowEmoji] = useState(false)
  const [isLove, setIsLove] = useState(true)
  const [hearts, setHearts] = useState<number | null | undefined>(null)
  const [gamesWon, setGamesWon] = useState(
    parseInt(localStorage.getItem(GAMES_WON_KEY) || '0', 10),
  )

  const goToGame = () => {
    setHearts(INITIAL_HEARTS)
    setScore(INITIAL_SCORE)
    setShowEmoji(false)
    const allPairs = generateAllPairs()
    setPairs(allPairs)
    setCurrentPair(pickRandomPair(allPairs))
  }

  const getValue = (): number => parseInt(inputRef?.current?.value || '0', 10)

  const resetInput = (): void => {
    if (inputRef && inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const updateScore = (): void => {
    const [left, right] = currentPair
    setPrevLeft(left)
    setPrevRight(right)

    const currentValue = getValue()
    const isCurrentLove = left * right === currentValue
    const newScore = isCurrentLove ? score + 1 : score
    const newHearts = hearts ? (isCurrentLove ? hearts : hearts - 1) : 0
    let newPairs = pairs

    if (isCurrentLove) {
      newPairs = pairs.filter(([l, r]) => !(l === left && r === right))
    }

    setScore(newScore)
    setHearts(newHearts)
    setPairs(newPairs)

    if (isCurrentLove && newPairs.length === 0) {
      const updatedGamesWon = gamesWon + 1
      setGamesWon(updatedGamesWon)
      localStorage.setItem(GAMES_WON_KEY, String(updatedGamesWon))
      setShowEmoji(false)
      setIsLove(true)
      setPrevLeft(-Infinity)
      setPrevRight(-Infinity)
      setTimeout(() => setHearts(null), 1000) // Show win for a moment, then go to end
      resetInput()
      return
    }

    if (newHearts > 0) {
      setShowEmoji(true)
      setIsLove(isCurrentLove)
      if (newPairs.length > 0) {
        setCurrentPair(pickRandomPair(newPairs))
      }
    } else {
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

    const [left, right] = currentPair

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
    }
  }, [])

  return (
    <div className="App" role="main">
      <React.StrictMode>
        {hearts === null ? (
          <StartScene
            onClick={goToGame}
            topScore={getTopScore()}
            gamesWon={gamesWon}
          />
        ) : hearts != null && hearts > 0 ? (
          renderGameScene()
        ) : (
          <EndScene score={score} onClick={goToGame} gamesWon={gamesWon} />
        )}
      </React.StrictMode>
    </div>
  )
}

export default App
