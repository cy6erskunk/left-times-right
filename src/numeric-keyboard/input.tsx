import React, { useState, useRef, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { NumericKeyboard } from './keyboard.jsx'
import * as Keys from './lib/keys.js'
import './lib/styles/styles.css'

const RNumber = /^\d*(?:\.\d*)?$/
const RTel = /^\d*$/

type AciveInput = {
  inputElement: HTMLInputElement | null
  keyboardElement: HTMLElement
}

type KeyboardManagerType = {
  activeInput: null | AciveInput
  closeKeyboardFn: null | ((skipAnimation?: boolean) => void)
  documentClickHandler: null | ((e: MouseEvent) => void)
  eventListenerAdded: boolean
  register: (
    input: AciveInput,
    closeKeyboard: (skipAnimation?: boolean) => void,
  ) => void
  unregister: () => void
  cleanup: () => void
}

// Single keyboard manager to ensure only one keyboard is visible at a time
export const KeyboardManager: KeyboardManagerType = {
  activeInput: null,
  closeKeyboardFn: null,
  documentClickHandler: null,
  eventListenerAdded: false,

  register(input, closeKeyboard) {
    // Clean up any existing keyboard first
    this.unregister()

    this.activeInput = input
    this.closeKeyboardFn = closeKeyboard

    // Create document click handler if needed
    if (!this.documentClickHandler) {
      this.documentClickHandler = (e) => {
        // Skip if no active input (already unregistered)
        if (!this.activeInput) {
          return
        }

        const { inputElement, keyboardElement } = this.activeInput

        // Don't close if clicking within input or keyboard
        if (inputElement && inputElement.contains(e.target as Node)) {
          return
        }
        if (keyboardElement && keyboardElement.contains(e.target as Node)) {
          return
        }

        // Close keyboard - clicked outside
        if (this.closeKeyboardFn) {
          this.closeKeyboardFn()
        }

        this.unregister()
      }
    }

    // Add event listener if not already added
    if (!this.eventListenerAdded) {
      if (!this.documentClickHandler) {
        const documentClickHandler = this.documentClickHandler
        // Add with a small delay to avoid immediate triggering
        setTimeout(() => {
          document.addEventListener('click', documentClickHandler)
          this.eventListenerAdded = true
        }, 100)
      }
    }
  },

  unregister() {
    // Remove event listener
    if (this.eventListenerAdded && this.documentClickHandler) {
      document.removeEventListener('click', this.documentClickHandler)
      this.eventListenerAdded = false
    }

    // Clear references
    this.activeInput = null
    this.closeKeyboardFn = null
  },

  // This method will be called by the App when unmounting all components
  cleanup() {
    if (this.closeKeyboardFn) {
      // Pass true to skip animation for immediate cleanup
      this.closeKeyboardFn(true)
    }

    // Then unregister
    this.unregister()

    // Final safety check: remove any orphaned keyboard elements
    const orphanedKeyboards = document.querySelectorAll(
      '.numeric-keyboard-actionsheet',
    )
    if (orphanedKeyboards.length > 0) {
      orphanedKeyboards.forEach((el) => {
        if (document.body.contains(el)) {
          document.body.removeChild(el)
        }
      })
    }
  },
}

type NumericInputType = {
  type?: string
  value?: string
  autofocus?: boolean
  disabled?: boolean
  readonly?: boolean
  maxlength?: number
  placeholder?: string
  format?: string
  layout?: string
  entertext?: string
  onFocus?: () => void
  onBlur?: () => void
  onInput: (input: string) => void
  onEnterpress: () => void
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
}: NumericInputType) {
  // Parse the format option
  const getFormatFn = () => {
    if (typeof format === 'function') {
      return format
    }
    return (val: string) => new RegExp(format).test(val)
  }

  // State
  const [rawValue, setRawValue] = useState(value.toString().split(''))
  const cursorPosRef = useRef<number>(value.toString().length)
  const [cursorActive, setCursorActive] = useState(false)
  const [cursorColor, setCursorColor] = useState<string>('')
  const [keyboard, setKeyboard] = useState<{
    root: ReturnType<typeof createRoot>
    element: HTMLElement
  } | null>(null)

  // Refs
  const inputRef = useRef<HTMLInputElement | null>(null)
  const keyboardContainerRef = useRef<HTMLElement | null>(null)
  const formatFnRef = useRef<Function>(getFormatFn())
  const lastCursorOffsetRef = useRef<number | null>(null)
  const lastMaxWidthRef = useRef<number | null>(null)

  // Update the underlying value when props change
  useEffect(() => {
    if (value.toString() !== rawValue.join('')) {
      const newRawValue = value.toString().split('')
      setRawValue(newRawValue)
      cursorPosRef.current = newRawValue.length
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

    // No cleanup needed in this case
    return undefined
  }, [])

  // Add a dedicated cleanup effect
  useEffect(() => {
    // This will be called when component unmounts
    return () => {
      if (keyboard) {
        // Use our closeKeyboard function with skipAnimation=true
        closeKeyboard(true)
      }
    }
  }, [keyboard])

  // Update cursor position
  useEffect(() => {
    if (!cursorActive) {
      return
    }

    const elCursor = inputRef.current?.querySelector<HTMLElement>(
      '.numeric-input-cursor',
    )
    const elText = inputRef.current?.querySelector<HTMLElement>(
      '.numeric-input-text',
    )
    if (elCursor && elText) {
      const elCharacter = elText.querySelector<HTMLElement>(
        `span:nth-child(${cursorPosRef.current})`,
      )

      if (!elCharacter) {
        elCursor.style.transform = 'translateX(0)'
        elText.style.transform = 'translateX(0)'
        return
      } else {
        const cursorOffset = elCharacter.offsetLeft + elCharacter.offsetWidth
        const maxVisibleWidth = (elText.parentNode as HTMLElement)?.offsetWidth

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
  }, [cursorPosRef.current, cursorActive, rawValue])

  type Key = (typeof Keys)[keyof typeof Keys]
  // Input handling
  const handleInput = (key: Key) => {
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
        if (cursorPosRef.current > 0) {
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

  const insertCharacter = (key: Key) => {
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
        cursorPosRef.current += 1
      }, 0)

      if (onInput) {
        onInput(newValue)
      }

      return newRawValue
    })
  }

  const deleteCharacter = () => {
    if (cursorPosRef.current <= 0) {
      return
    }

    // Use a functional update to ensure we're working with the latest state
    setRawValue((prevRawValue) => {
      const newRawValue = [...prevRawValue]
      newRawValue.splice(cursorPosRef.current - 1, 1)
      const newValue = newRawValue.join('')

      if (!formatFnRef.current(newValue)) {
        return prevRawValue
      }

      // Update cursor position on success
      // Need to use setTimeout to ensure state is updated correctly
      setTimeout(() => {
        cursorPosRef.current -= 1
      }, 0)

      // Call onInput
      if (onInput) {
        onInput(newValue)
      }

      return newRawValue
    })
  }

  // Focus handling
  const handleFocus = (e: TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // If we're touching a specific character, set the cursor there
    if (
      (e.target as HTMLElement)?.tagName === 'SPAN' &&
      (e.target as HTMLElement)?.dataset.index
    ) {
      const index = Number((e.target as HTMLElement)?.dataset?.index)
      const newCursorPos = isNaN(index) ? rawValue.length : index
      cursorPosRef.current = newCursorPos
    } else {
      // Otherwise, put cursor at end
      cursorPosRef.current = rawValue.length
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
    cursorPosRef.current = rawValue.length
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

  const closeKeyboard = (skipAnimation = false) => {
    if (!keyboard) {
      return
    }

    // Get keyboard elements
    const { root, element } = keyboard

    if (skipAnimation) {
      // Skip animation for immediate cleanup
      root.unmount()
      if (keyboardContainerRef.current) {
        if (document.body.contains(keyboardContainerRef.current)) {
          document.body.removeChild(keyboardContainerRef.current)
        }
        keyboardContainerRef.current = null
      }
    } else {
      // Animate out
      element.style.transform = 'translateY(100%)'

      // Clean up after animation
      setTimeout(() => {
        root.unmount()
        if (keyboardContainerRef.current) {
          if (document.body.contains(keyboardContainerRef.current)) {
            document.body.removeChild(keyboardContainerRef.current)
          }
          keyboardContainerRef.current = null
        }
      }, 300)
    }

    setCursorActive(false)
    cursorPosRef.current = 0
    rawValue.length
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
    <div
      ref={inputRef}
      className={className}
      onTouchEnd={
        handleFocus as unknown as React.TouchEventHandler<HTMLDivElement>
      }
    >
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
