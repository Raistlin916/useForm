import React, {
  useState,
  ReactElement,
  SetStateAction,
  Dispatch,
  ChangeEvent,
} from 'react'
import _ from 'lodash'

type NameType = string | string[]

type FieldElem = ReactElement<{
  name: NameType
  value?: any
  onChange: (e: ChangeEvent<HTMLInputElement>) => any
}>
type BindField = <E extends FieldElem>(elem: E, bindOpt?: {}) => E
type UseFormOpt<S> = {
  handleElement?: (elem: FieldElem, fieldValue: S, name: NameType) => any
  handleOnChanged?: (targetValue: S, name: NameType, value: any) => S
}

export type UseField = <S extends object>(
  fieldValue: S,
  onChange: Dispatch<S>,
  options?: UseFormOpt<S>
) => BindField

export type UseForm = <S extends object>(
  initialState: S,
  useFormOpt?: UseFormOpt<S>
) => [
  S,
  BindField,
  {
    setFormState: Dispatch<SetStateAction<S>>
    reset: () => void
  }
]

function getValueFromEvent(e: ChangeEvent<HTMLInputElement>) {
  if (e && e.target) {
    return (e.target.type || '').toLowerCase() === 'checkbox'
      ? e.target.checked
      : e.target.value
  }
  return e
}

export const useField: UseField = (fieldValue, onChange, options = {}) => {
  const { handleElement, handleOnChanged } = options
  return (elem, bindOpt = {}) => {
    const { name } = elem.props
    const isMultipleNames = Array.isArray(name)
    const names = (isMultipleNames ? name : [name]) as string[]
    const value = names.map((n) => _.get(fieldValue, n))
    const props = {
      value: isMultipleNames ? value : value[0],
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        const changedValue = getValueFromEvent(e)
        if (onChange) {
          let targetValue = names.reduce((pre, cur, index) => {
            return {
              ...pre,
              [cur]: Array.isArray(changedValue)
                ? changedValue[index]
                : changedValue,
            }
          }, fieldValue)

          if (handleOnChanged) {
            targetValue = handleOnChanged(
              targetValue,
              isMultipleNames ? names : name,
              changedValue
            )
          }
          onChange(targetValue)
        }
      },
    }
    const processedElement = React.cloneElement(elem, props)
    if (handleElement) {
      return handleElement(processedElement, fieldValue, name)
    }
    return processedElement
  }
}

const useForm: UseForm = (initialState, useFormOpt = {}) => {
  const [formState, setFormState] = useState(initialState)
  const bindField = useField(formState, setFormState, useFormOpt)
  return [
    formState,
    bindField,
    {
      setFormState,
      reset: () => {
        setFormState(initialState)
      },
    },
  ]
}

export default useForm
