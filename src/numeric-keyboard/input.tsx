import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { NumericKeyboard } from './keyboard.jsx'
import * as Keys from './lib/keys.js'
import './lib/styles/styles.css'

// Regular expressions for validation
const RNumber = /^\d*(?:\.\d*)?$/
const RTel = /^\d*$/

export function NumericInput({
  type = 'number',
  value = '',
  autofocus = false,
  disabled = false,
  readonly = false,
  maxlength = Infinity,
  placeholder = '',
  format = '^',
  layout = 'number',
  entertext = 'enter',
  onFocus = () => {},
  onBlur = () => {},
  onInput,
  onEnterpress,
}) {
  // State
  const [rawValue, setRawValue] = useState(value.toString().split(''))
  const [cursorPos, setCursorPos] = useState(value.toString().length)
  const [cursorActive, setCursorActive] = useState(false)
  const [cursorColor, setCursorColor] = useState('')
  const [keyboardVisible, setKeyboardVisible] = useState(false)

  // Refs
  const inputRef = useRef(null)
  const keyboardContainerRef = useRef(null)
  const lastCursorOffsetRef = useRef(null)
  const lastMaxWidthRef = useRef(null)

  // Format function
  const formatFn =
    typeof format === 'function'
      ? format
      : (val) => new RegExp(format).test(val)

  // Update value when props change
  useEffect(() => {
    if (value.toString() !== rawValue.join('')) {
      const newRawValue = value.toString().split('')
      setRawValue(newRawValue)
      setCursorPos(newRawValue.length)
    }
  }, [value])

  // Setup cursor color
  useEffect(() => {
    if (inputRef.current) {
      const computedStyle = window.getComputedStyle(inputRef.current)
      setCursorColor(computedStyle.getPropertyValue('color'))
    }

    // Auto-focus if requested
    if (autofocus && !readonly && !disabled) {
      const timer = setTimeout(() => openKeyboard(), 500)
      return () => clearTimeout(timer)
    }
  }, [])

  // Handle click outside to close keyboard
  useEffect(() => {
    if (!keyboardVisible) return

    const handleClickOutside = (e) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        keyboardContainerRef.current &&
        !keyboardContainerRef.current.contains(e.target)
      ) {
        closeKeyboard()
      }
    }

    // Add with a small delay to avoid immediate triggering
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [keyboardVisible])

  // Update cursor position when cursor is active or value changes
  useEffect(() => {
    if (!cursorActive) return

    const elCursor = inputRef.current?.querySelector('.numeric-input-cursor')
    const elText = inputRef.current?.querySelector('.numeric-input-text')

    if (elCursor && elText) {
      const elCharacter = elText.querySelector(`span:nth-child(${cursorPos})`)

      if (!elCharacter) {
        elCursor.style.transform = 'translateX(0)'
        elText.style.transform = 'translateX(0)'
        return
      } else {
        const cursorOffset = elCharacter.offsetLeft + elCharacter.offsetWidth
        const maxVisibleWidth = elText.parentNode?.offsetWidth

        if (
          lastCursorOffsetRef.current !== cursorOffset ||
          lastMaxWidthRef.current !== maxVisibleWidth
        ) {
          elCursor.style.transform = `translateX(${Math.min(maxVisibleWidth - 1, cursorOffset)}px)`
          elText.style.transform = `translateX(${Math.min(0, maxVisibleWidth - cursorOffset)}px)`

          lastCursorOffsetRef.current = cursorOffset
          lastMaxWidthRef.current = maxVisibleWidth
        }
      }
    }
  }, [cursorPos, cursorActive, rawValue])

  // Keyboard handlers
  const handleInput = (key) => {
    switch (key) {
      case Keys.BLANK:
        break
      case Keys.ESC:
        closeKeyboard()
        break
      case Keys.ENTER:
        closeKeyboard()
        if (onEnterpress) {
          onEnterpress()
        }
        break
      case Keys.DEL:
        if (cursorPos > 0) {
          deleteCharacter()
        }
        break
      case Keys.DOT:
      case Keys.ZERO:
      case Keys.ONE:
      case Keys.TWO:
      case Keys.THREE:
      case Keys.FOUR:
      case Keys.FIVE:
      case Keys.SIX:
      case Keys.SEVEN:
      case Keys.EIGHT:
      case Keys.NINE:
      default:
        insertCharacter(key)
        break
    }
  }

  const insertCharacter = (key) => {
    const newRawValue = [...rawValue]
    // Instead of inserting at cursor position, append to the end
    newRawValue.push(key)
    const newValue = newRawValue.join('')

    // Apply format validation
    if (!formatFn(newValue)) {
      return
    }

    // Type validation
    if (type === 'number') {
      if (!RNumber.test(newValue)) {
        return
      }

      if (newValue !== '') {
        const parsed = parseFloat(newValue)
        if (isNaN(parsed)) {
          return
        }
      }
    } else if (
      newValue.length > maxlength ||
      (type === 'tel' && !RTel.test(newValue))
    ) {
      return
    }

    // Update state
    setRawValue(newRawValue)
    setCursorPos((prev) => prev + 1)

    // Call onInput callback
    if (onInput) {
      onInput(newValue)
    }
  }

  const deleteCharacter = () => {
    if (cursorPos <= 0) {
      return
    }

    const newRawValue = [...rawValue]
    newRawValue.splice(cursorPos - 1, 1)
    const newValue = newRawValue.join('')

    // Apply format validation
    if (!formatFn(newValue)) {
      return
    }

    // Update state
    setRawValue(newRawValue)
    setCursorPos((prev) => prev - 1)

    // Call onInput callback
    if (onInput) {
      onInput(newValue)
    }
  }

  // Focus handling
  const handleFocus = (e) => {
    e.preventDefault()
    e.stopPropagation()

    // If we're touching a specific character, set the cursor there
    if (e.target?.tagName === 'SPAN' && e.target?.dataset.index) {
      const index = Number(e.target?.dataset?.index)
      const newCursorPos = isNaN(index) ? rawValue.length : index
      setCursorPos(newCursorPos)
    } else {
      // Otherwise, put cursor at end
      setCursorPos(rawValue.length)
    }

    // Always open keyboard when focused
    openKeyboard()
  }

  // Keyboard management
  const openKeyboard = () => {
    if (keyboardVisible || readonly || disabled) {
      return
    }

    setKeyboardVisible(true)
    setCursorActive(true)
    setCursorPos(rawValue.length)

    if (onFocus) {
      onFocus()
    }
  }

  const closeKeyboard = () => {
    setKeyboardVisible(false)
    setCursorActive(false)
    setCursorPos(0)

    if (onBlur) {
      onBlur()
    }
  }

  // Render keyboard with Portal
  const renderKeyboard = () => {
    if (!keyboardVisible) return null

    return createPortal(
      <div className="numeric-keyboard-actionsheet" ref={keyboardContainerRef}>
        <div className="keyboard-shadow"></div>
        <div
          className="keyboard-wrapper"
          style={{
            transition: 'transform 0.3s ease-out',
            transform: 'translateY(0)',
          }}
        >
          <NumericKeyboard
            layout={layout || type}
            entertext={entertext}
            onPress={handleInput}
          />
        </div>
      </div>,
      document.body,
    )
  }

  // Determine component class names
  let className = 'numeric-input'
  if (readonly) {
    className += ' readonly'
  }
  if (disabled) {
    className += ' disabled'
  }

  return (
    <>
      <div ref={inputRef} className={className} onTouchEnd={handleFocus}>
        <div>
          <div className="numeric-input-text">
            {rawValue.map((char, i) => (
              <span key={i} data-index={i}>
                {char}
              </span>
            ))}
          </div>
          {rawValue.length === 0 && (
            <div className="numeric-input-placeholder">{placeholder}</div>
          )}
          {cursorActive && (
            <div
              className="numeric-input-cursor"
              style={{ background: cursorColor }}
            />
          )}
        </div>
      </div>
      {renderKeyboard()}
    </>
  )
}
