// Use native requestAnimationFrame for smoother animations
const requestFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.setTimeout

export const animate = function animate(
  iterable,
  done = () => {
    /* noop */
  },
  frames = 15,
) {
  let running = true
  let frame = 0
  let lastTime = 0

  // Use performance.now() for more accurate timing
  const now =
    typeof performance !== 'undefined' && performance.now
      ? () => performance.now()
      : () => Date.now()

  const closure = () => {
    if (!running) {
      return
    }

    const timestamp = now()
    // Only run if enough time has passed
    if (timestamp - lastTime > 12 || frame === 0) {
      // aim for smoother animation
      lastTime = timestamp
      iterable(timestamp, ++frame, frames)
    }

    if (frame < frames) {
      requestFrame(closure)
    } else {
      done()
    }
  }

  // Start the animation
  requestFrame(closure)

  // Return a function to cancel the animation
  return () => {
    running = false
  }
}
