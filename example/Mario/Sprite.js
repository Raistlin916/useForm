import React, { useState, useEffect } from 'react'

export default () => {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  })
  const handleInput = e => {
    const effect = { ...position }
    if (e.key === 'a') {
      effect.x -= 1
    }
    if (e.key === 'd') {
      effect.x += 1
    }
    setPosition(effect)
  }
  useEffect(() => {
    document.body.addEventListener('keypress', handleInput)
    return () => {
      document.body.removeEventListener('keypress', handleInput)
    }
  }, [position])
  const style = {
    position: 'relative',
    left: position.x,
    top: position.y
  }
  return <div style={style}>Mario</div>
}
