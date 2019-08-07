import React, { useState } from 'react'
import _ from 'lodash'

function getValueFromEvent(e) {
  if (e && e.target) {
    return (e.target.type || '').toLowerCase() === 'checkbox'
      ? e.target.checked
      : e.target.value
  }
  return e
}

export const useField = (fieldValue, onChange, options = {}) => {
  const { handleElement, handleOnChanged } = options
  return (elem, bindOpt = {}) => {
    const { name } = elem.props
    const value = _.get(fieldValue, name)
    const props = {
      value,
      onChange: e => {
        const value = getValueFromEvent(e)
        if (onChange) {
          let targetValue = _.set(_.clone(fieldValue), name, value)
          if (handleOnChanged) {
            targetValue = handleOnChanged(targetValue)
          }
          onChange(targetValue)
        }
      }
    }
    if (bindOpt.valueName) {
      props[bindOpt.valueName] = value
    }
    const processedElement = React.cloneElement(elem, props)
    if (handleElement) {
      return handleElement(processedElement, fieldValue, name)
    }
    return processedElement
  }
}

const useForm = (initialState, useFormOpt = {}) => {
  const [formState, setFormState] = useState(initialState)
  const bindField = useField(formState, setFormState, useFormOpt)
  return [
    formState,
    bindField,
    {
      setFormState,
      reset: () => {
        setFormState(initialState)
      }
    }
  ]
}

export default useForm
