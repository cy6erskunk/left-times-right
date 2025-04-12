import React from 'react'
import { ENTER } from './lib/keys.js'
import Layouts from './lib/layouts/index.js'

export function NumericKeyboard({
  layout = 'number',
  entertext = 'enter',
  onEnterpress = undefined,
  onPress,
}) {
  // Get the proper layout based on the prop value
  let resolvedLayout
  if (typeof layout === 'string') {
    resolvedLayout = Layouts[layout]
    if (!Array.isArray(resolvedLayout)) {
      throw new Error(`${layout} is not a built-in layout.`)
    }
  } else {
    resolvedLayout = layout
    if (
      !Array.isArray(resolvedLayout) ||
      !resolvedLayout.every((i) => Array.isArray(i))
    ) {
      throw new Error(`Custom layout must be a two-dimensional array.`)
    }
  }

  // Handle key press event
  const handleKeyPress = (key, event) => {
    if (event) {
      event.preventDefault()
      // Don't stop propagation for normal key presses to allow multiple inputs
      if (key === ENTER) {
        // Only stop propagation for ENTER to prevent form submission
        event.nativeEvent.stopImmediatePropagation()
      }
    }

    if (onPress) {
      onPress(key)
    }

    if (key === ENTER && onEnterpress) {
      onEnterpress()
    }
  }

  return (
    <table className="numeric-keyboard">
      <tbody>
        {resolvedLayout.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell) => (
              <td
                key={cell.key}
                rowSpan={cell.rowspan}
                colSpan={cell.colspan}
                data-key={cell.key}
                data-icon={cell.key === ENTER ? entertext : cell.key}
                className="numeric-keyboard-key"
                onMouseDown={(e) => {
                  // Prevent default behavior
                  e.preventDefault()
                }}
                onTouchStart={(e) => {
                  // Prevent default behavior
                  // e.preventDefault();
                  e.currentTarget.classList.add('active')
                }}
                onTouchEnd={(e) => {
                  // Process key on touch end
                  e.preventDefault()
                  e.stopPropagation()
                  e.currentTarget.classList.remove('active')
                  handleKeyPress(cell.key, e)
                }}
                onClick={(e) => {
                  // For desktop support
                  e.preventDefault()
                  e.stopPropagation()
                  handleKeyPress(cell.key, e)
                }}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
