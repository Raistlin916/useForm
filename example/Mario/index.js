import React from 'react'
import useForm from '@uselife/useform'
import Sprite from './Sprite'

export default function Mario({ children }) {
  const [formState, bindField] = useForm({
  })
  return (
    <div>
      {bindField(<Sprite />)}
    </div>
  )
}
