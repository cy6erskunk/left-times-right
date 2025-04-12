import * as Keys from './keys.js'
import { animate } from './utils/animate.js'

const RNumber = /^\d*(?:\.\d*)?$/
const RTel = /^\d*$/

const KeyboardCenter = (function () {
  let activeInput

  return {
    register(input) {
      this.unregister()
      activeInput = input
      document.addEventListener('touchend', this.unregister, false)
    },
    unregister(e) {
      if (!activeInput) {
        return
      }
      if (
        e &&
        (activeInput.ks.inputElement.contains(e.target) ||
          activeInput.ks.keyboardElement.contains(e.target))
      ) {
        return
      }
      activeInput.closeKeyboard()
      activeInput = null
      document.removeEventListener('touchend', this.unregister, false)
    },
  }
})()

export const Options = {
  type: 'number',
  value: '',
  autofocus: false,
  disabled: false,
  readonly: false,
  maxlength: Infinity,
  name: '',
  placeholder: '',
  format: '^',
  layout: 'number',
  entertext: 'enter',
}

export const Mixins = {
  init(options) {
    let formatFn = options.format
    if (typeof formatFn === 'string') {
      formatFn = (
        (rformat) => (val) =>
          rformat.test(val)
      )(new RegExp(options.format))
    }

    const value = options.value
    const rawValue = value.toString().split('')
    const cursorPos = rawValue.length

    this.kp = options
    this.ks = {
      formatFn,
      value,
      rawValue,
      cursorPos,
      cursorColor: null,
      cursorActive: false,
      keyboard: null,
      inputElement: null,
      keyboardElement: null,
    }
  },

  destroy() {
    KeyboardCenter.unregister()
  },

  set(key, value) {
    this.ks[key] = value
  },

  onMounted(el) {
    this.set('inputElement', el)
    this.set(
      'cursorColor',
      window.getComputedStyle(el).getPropertyValue('color'),
    )

    if (this.kp.autofocus && !this.kp.readonly && !this.kp.disabled) {
      setTimeout(() => this.openKeyboard(), 500)
    }
  },

  onUpdated() {
    this.moveCursor()
  },

  onFocus(e) {
    e.stopPropagation()
    this.openKeyboard()
    const cursorPos = +e.target.dataset.index
    this.set(
      'cursorPos',
      isNaN(cursorPos) ? this.ks.rawValue.length : cursorPos,
    )
  },

  input(key) {
    const { type, maxlength } = this.kp
    const { rawValue, cursorPos, formatFn } = this.ks

    const input = (key) => {
      // Use performance-optimized approach
      const isAdd = typeof key !== 'undefined'
      let newValue
      let newRawValue
      let newCursorPos

      // Optimize by avoiding unnecessary array operations when possible
      if (isAdd) {
        // Fast path for adding a digit
        newRawValue = [...rawValue]
        newRawValue.splice(cursorPos, 0, key)
        newValue = newRawValue.join('')
        newCursorPos = cursorPos + 1
      } else {
        // Fast path for deleting a digit
        if (cursorPos <= 0) {
          return // Nothing to delete
        }
        newRawValue = [...rawValue]
        newRawValue.splice(cursorPos - 1, 1)
        newValue = newRawValue.join('')
        newCursorPos = cursorPos - 1
      }

      // Only format and validate if we have a valid input
      if (formatFn(newValue)) {
        if (type === 'number') {
          if (!RNumber.test(newValue)) {
            return
          }

          // Only parse if needed
          if (newValue !== '') {
            const parsed = parseFloat(newValue, 10)
            if (isNaN(parsed)) {
              newValue = ''
              newRawValue = []
              newCursorPos = 0
            } else {
              newValue = parsed
            }
          }
        } else if (
          newValue.length > maxlength ||
          (type === 'tel' && !RTel.test(newValue))
        ) {
          return
        }

        // Batch state updates for better performance
        this.set('value', newValue)
        this.set('rawValue', newRawValue)
        this.set('cursorPos', newCursorPos)

        // Dispatch the input event immediately
        this.dispatch('input', newValue)
      }
    }

    switch (key) {
      case Keys.BLANK:
        break
      case Keys.ESC:
        this.closeKeyboard()
        break
      case Keys.ENTER:
        this.closeKeyboard()
        this.dispatch('enterpress')
        break
      case Keys.DEL:
        if (cursorPos > 0) {
          input()
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
        input(key)
        break
    }
  },

  moveCursor() {
    if (!this.ks.cursorActive) {
      return
    }

    // Micro-optimization: Cache DOM queries since they're expensive
    const { inputElement } = this.ks
    if (!inputElement) {
      return
    }

    const elCursor = inputElement.querySelector('.numeric-input-cursor')
    const elText = inputElement.querySelector('.numeric-input-text')
    if (!elCursor || !elText) {
      return
    }

    // Find character element at cursor position
    const elCharactor = elText.querySelector(
      `span:nth-child(${this.ks.cursorPos})`,
    )

    // Handle case when cursor is at beginning or no characters
    if (!elCharactor) {
      // Use direct style setting for better performance
      elCursor.style.transform = 'translateX(0)'
      elText.style.transform = 'translateX(0)'
      return
    }

    // Use hardware-accelerated transforms for smooth animation
    const cursorOffset = elCharactor.offsetLeft + elCharactor.offsetWidth
    const maxVisibleWidth = elText.parentNode.offsetWidth

    // Avoid calculating values if they haven't changed
    if (
      this._lastCursorOffset !== cursorOffset ||
      this._lastMaxWidth !== maxVisibleWidth
    ) {
      elCursor.style.transform = `translateX(${Math.min(maxVisibleWidth - 1, cursorOffset)}px)`
      elText.style.transform = `translateX(${Math.min(0, maxVisibleWidth - cursorOffset)}px)`

      // Cache these values to avoid unnecessary updates
      this._lastCursorOffset = cursorOffset
      this._lastMaxWidth = maxVisibleWidth
    }
  },

  openKeyboard() {
    if (this.ks.keyboard) {
      return
    }

    const elContainer = document.createElement('div')
    const elShadow = document.createElement('div')
    const elKeyboard = document.createElement('div')
    elContainer.className = 'numeric-keyboard-actionsheet'
    elContainer.appendChild(elShadow)
    elContainer.appendChild(elKeyboard)
    document.body.appendChild(elContainer)

    this.createKeyboard(
      elKeyboard,
      {
        layout: this.kp.layout || this.kp.type,
        entertext: this.kp.entertext,
      },
      {
        press: this.input.bind(this),
      },
      (keyboard) => this.set('keyboard', keyboard),
    )

    animate(
      (_timestamp, frame, frames) => {
        elKeyboard.style.transform = `translateY(${((frames - frame) / frames) * 100}%)`
      },
      () => {},
      10,
    )

    this.set('keyboardElement', elKeyboard)
    this.set('cursorActive', true)
    this.set('cursorPos', this.ks.rawValue.length)

    this.dispatch('focus')
    KeyboardCenter.register(this)
  },

  closeKeyboard() {
    if (!this.ks.keyboard) {
      return
    }

    const keyboard = this.ks.keyboard
    const elKeyboard = this.ks.keyboardElement

    animate(
      (_timestamp, frame, frames) => {
        elKeyboard.style.transform = `translateY(${(frame / frames) * 100}%)`
      },
      () => {
        setTimeout(() => {
          this.destroyKeyboard(elKeyboard, keyboard)
          document.body.removeChild(elKeyboard.parentNode)
        }, 300)
      },
      10,
    )

    this.set('keyboard', null)
    this.set('keyboardElement', null)
    this.set('cursorActive', false)
    this.set('cursorPos', 0)

    this.dispatch('blur')
    KeyboardCenter.unregister()
  },

  createKeyboard(/* el, options, events, callback */) {
    throw new Error('createKeyboard method must be overrided!')
  },

  destroyKeyboard(/* el, keyboard */) {
    throw new Error('destroyKeyboard method must be overrided!')
  },

  dispatch(/* event, payload */) {
    throw new Error('dispatch method must be overrided!')
  },
}
