import React, { useEffect, useReducer } from 'react'

function reducer(state, action) {
  switch (action.type) {
    case 'right':
      return { ...state, x: state.x + 1 }
    case 'left':
      return { ...state, x: state.x - 1 }
    default:
      throw new Error()
  }
}

export default () => {
  const [position, dispatch] = useReducer(reducer, { x: 0, y: 0 })
  const handleInput = e => {
    if (e.key === 'a') {
      dispatch({ type: 'left' })
    }
    if (e.key === 'd') {
      dispatch({ type: 'right' })
    }
  }
  useEffect(() => {
    document.body.addEventListener('keypress', handleInput)
    return () => {
      document.body.removeEventListener('keypress', handleInput)
    }
  }, [])
  const style = {
    position: 'relative',
    left: position.x,
    top: position.y
  }
  return <div style={style}>Mario</div>
}
