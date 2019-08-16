import React from 'react'
import PropTypes from 'prop-types'
import useForm from '@uselife/useform'

export default function Mario({ children }) {
  const [formState, bindField] = useForm({
    username: '123'
  })
  return (
    <div>
      <div>{formState.username}</div>
      {bindField(<input type="text" name="username" />)}
    </div>
  )
}
