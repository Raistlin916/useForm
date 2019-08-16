import React from 'react'
import useForm from '@uselife/useform'

export default function Normal({ children }) {
  const [formState, bindField] = useForm({
    username: '1234'
  })
  return (
    <div>
      <div>{formState.username}</div>
      {bindField(<input type="text" name="username" />)}
    </div>
  )
}
