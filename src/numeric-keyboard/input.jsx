import React, { useState, useRef, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import * as Keys from './lib/keys.js'
import { NumericKeyboard } from './keyboard.jsx'
import './lib/styles/styles.css'

const RNumber = /^\d*(?:\.\d*)?$/
const RTel = /^\d*$/

// Single keyboard manager to ensure only one keyboard is visible at a time
const KeyboardManager = {
  activeInput: null,
  closeKeyboardFn: null,
  documentClickHandler: null,

  register(input, closeKeyboard) {
    this.unregister()
    this.activeInput = input
    this.closeKeyboardFn = closeKeyboard

    // Use more reliable document click handler that won't interfere with keyboard events
    this.documentClickHandler = (e) => {
      // Don't close when clicking within input or keyboard
      if (!this.activeInput) {
        return
      }

      const { inputElement, keyboardElement } = this.activeInput

      if (inputElement && inputElement.contains(e.target)) {
        return
      }
      if (keyboardElement && keyboardElement.contains(e.target)) {
        return
      }

      // Safe to close - clicked outside both input and keyboard
      if (this.closeKeyboardFn) {
        this.closeKeyboardFn()
      }

      this.unregister()
    }

    // Add with a small delay to avoid immediate triggering
    setTimeout(() => {
      document.addEventListener('click', this.documentClickHandler)
    }, 100)
  },

  unregister() {
    if (this.documentClickHandler) {
      document.removeEventListener('click', this.documentClickHandler)
      this.documentClickHandler = null
    }

    this.activeInput = null
    this.closeKeyboardFn = null
  },
}

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
  onFocus = undefined,
  onBlur = undefined,
  onInput,
  onEnterpress,
}) {
  // Parse the format option
  const getFormatFn = () => {
    if (typeof format === 'function') {
      return format
    }
    return (val) => new RegExp(format).test(val)
  }

  // State
  const [rawValue, setRawValue] = useState(value.toString().split(''))
  const [cursorPos, setCursorPos] = useState(value.toString().length)
  const [cursorActive, setCursorActive] = useState(false)
  const [cursorColor, setCursorColor] = useState(null)
  const [keyboard, setKeyboard] = useState(null)

  // Refs
  const inputRef = useRef(null)
  const keyboardContainerRef = useRef(null)
  const formatFnRef = useRef(getFormatFn())
  const lastCursorOffsetRef = useRef(null)
  const lastMaxWidthRef = useRef(null)

  // Update the underlying value when props change
  useEffect(() => {
    if (value.toString() !== rawValue.join('')) {
      const newRawValue = value.toString().split('')
      setRawValue(newRawValue)
      setCursorPos(newRawValue.length)
    }
  }, [value])

  // Initial setup and cleanup
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

    return () => {
      closeKeyboard()
      KeyboardManager.unregister()
    }
  }, [])

  // Update cursor position
  useEffect(() => {
    if (!cursorActive) {
      return
    }

    const elCursor = inputRef.current?.querySelector('.numeric-input-cursor')
    const elText = inputRef.current?.querySelector('.numeric-input-text')
    if (!elCursor || !elText) {
      return
    }

    const elCharacter = elText.querySelector(`span:nth-child(${cursorPos})`)

    if (!elCharacter) {
      elCursor.style.transform = 'translateX(0)'
      elText.style.transform = 'translateX(0)'
      return
    }

    const cursorOffset = elCharacter.offsetLeft + elCharacter.offsetWidth
    const maxVisibleWidth = elText.parentNode.offsetWidth

    if (
      lastCursorOffsetRef.current !== cursorOffset ||
      lastMaxWidthRef.current !== maxVisibleWidth
    ) {
      elCursor.style.transform = `translateX(${Math.min(maxVisibleWidth - 1, cursorOffset)}px)`
      elText.style.transform = `translateX(${Math.min(0, maxVisibleWidth - cursorOffset)}px)`

      lastCursorOffsetRef.current = cursorOffset
      lastMaxWidthRef.current = maxVisibleWidth
    }
  }, [cursorPos, cursorActive, rawValue])

  // Input handling
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
    // Use a functional update to ensure we're working with the latest state
    setRawValue((prevRawValue) => {
      const newRawValue = [...prevRawValue]
      // newRawValue.splice(cursorPos, 0, key)
      newRawValue.push(key)
      const newValue = newRawValue.join('')

      if (!formatFnRef.current(newValue)) {
        return prevRawValue
      }

      if (type === 'number') {
        if (!RNumber.test(newValue)) {
          return prevRawValue
        }

        if (newValue !== '') {
          const parsed = parseFloat(newValue)
          if (isNaN(parsed)) {
            return prevRawValue
          }
        }
      } else if (
        newValue.length > maxlength ||
        (type === 'tel' && !RTel.test(newValue))
      ) {
        return prevRawValue
      }

      // Update cursor position on success
      // Need to use setTimeout to ensure state is updated correctly
      setTimeout(() => {
        setCursorPos((current) => current + 1)
      }, 0)

      if (onInput) {
        onInput(newValue)
      }

      return newRawValue
    })
  }

  const deleteCharacter = () => {
    if (cursorPos <= 0) {
      return
    }

    // Use a functional update to ensure we're working with the latest state
    setRawValue((prevRawValue) => {
      const newRawValue = [...prevRawValue]
      newRawValue.splice(cursorPos - 1, 1)
      const newValue = newRawValue.join('')

      if (!formatFnRef.current(newValue)) {
        return prevRawValue
      }

      // Update cursor position on success
      // Need to use setTimeout to ensure state is updated correctly
      setTimeout(() => {
        setCursorPos((current) => current - 1)
      }, 0)

      // Call onInput
      if (onInput) {
        onInput(newValue)
      }

      return newRawValue
    })
  }

  // Focus handling
  const handleFocus = (e) => {
    e.preventDefault()
    e.stopPropagation()

    // If we're touching a specific character, set the cursor there
    if (e.target.tagName === 'SPAN' && e.target.dataset.index) {
      const index = +e.target.dataset.index
      setCursorPos(isNaN(index) ? rawValue.length : index)
    } else {
      // Otherwise, put cursor at end
      setCursorPos(rawValue.length)
    }

    // Always open keyboard when focused
    openKeyboard()
  }

  // Keyboard management
  const openKeyboard = () => {
    if (keyboard || readonly || disabled) {
      return
    }

    // Create container for the keyboard
    const container = document.createElement('div')
    container.className = 'numeric-keyboard-actionsheet'

    const shadow = document.createElement('div')
    const keyboardEl = document.createElement('div')

    container.appendChild(shadow)
    container.appendChild(keyboardEl)
    document.body.appendChild(container)

    keyboardContainerRef.current = container

    // Render the keyboard with React
    const root = createRoot(keyboardEl)
    root.render(
      <NumericKeyboard
        layout={layout || type}
        entertext={entertext}
        onPress={handleInput}
      />,
    )

    // Animate in
    keyboardEl.style.transform = 'translateY(100%)'
    setTimeout(() => {
      keyboardEl.style.transition = 'transform 0.3s ease-out'
      keyboardEl.style.transform = 'translateY(0)'
    }, 10)

    setCursorActive(true)
    setCursorPos(rawValue.length)
    setKeyboard({ root, element: keyboardEl })

    if (onFocus) {
      onFocus()
    }

    // Register with manager
    KeyboardManager.register(
      {
        inputElement: inputRef.current,
        keyboardElement: container, // Use the container instead of just the keyboard element
      },
      closeKeyboard,
    )
  }

  const closeKeyboard = () => {
    if (!keyboard) {
      return
    }

    // Animate out
    const { root, element } = keyboard

    element.style.transform = 'translateY(100%)'

    // Clean up after animation
    setTimeout(() => {
      root.unmount()
      if (keyboardContainerRef.current) {
        document.body.removeChild(keyboardContainerRef.current)
        keyboardContainerRef.current = null
      }
    }, 300)

    setCursorActive(false)
    setCursorPos(0)
    setKeyboard(null)

    if (onBlur) {
      onBlur()
    }
    KeyboardManager.unregister()
  }

  // Render
  let className = 'numeric-input'
  if (readonly) {
    className += ' readonly'
  }
  if (disabled) {
    className += ' disabled'
  }

  return (
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
  )
}
