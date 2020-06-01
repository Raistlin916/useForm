import React, {
  ReactElement,
  Dispatch,
  ChangeEvent,
  useReducer,
  Reducer,
  useEffect,
} from 'react'
import _ from 'lodash'

type NameType = string | string[]

type FieldElem = ReactElement<{
  name: NameType
  value?: any
  onChange: (e: ChangeEvent<HTMLInputElement>) => any
}>
type BindField = <E extends FieldElem>(
  elem: E,
  bindOpt?: { name?: NameType }
) => E
type UseFormOpt<S> = {
  handleElement?: (
    elem: FieldElem,
    fieldValue: Partial<S>,
    name: NameType
  ) => any
  handleOnChanged?: (targetValue: Partial<S>, name: NameType, value: any) => S
}

export type UseField = <S extends object>(
  fieldValue: S,
  onChange: Dispatch<Partial<S>>,
  options?: UseFormOpt<S>
) => BindField

export type UseForm = <S extends object>(
  initialState: S,
  useFormOpt?: UseFormOpt<S>
) => [
  S,
  BindField,
  {
    setFormState: (data: Partial<S>) => void
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
    const name = bindOpt.name || elem.props.name
    const isMultipleNames = Array.isArray(name)
    const names = (isMultipleNames ? name : [name]) as string[]
    const value = names.map((n) => _.get(fieldValue, n))
    const props = {
      value: isMultipleNames ? value : value[0],
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        const changedValue = getValueFromEvent(e)
        if (onChange) {
          let targetValue = names.reduce((pre, cur, index) => {
            let currentValue = changedValue
            if (isMultipleNames) {
              if (Array.isArray(changedValue)) {
                currentValue = changedValue[index]
              } else {
                throw new Error(
                  'multiple names onChange should return array values'
                )
              }
            }
            return {
              ...pre,
              [cur]: currentValue,
            }
          }, {})

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

type Action<T> =
  | { type: 'set'; payload: Partial<T> }
  | { type: 'reset'; payload: T }

const reducer = <T>(state: T, action: Action<T>) => {
  switch (action.type) {
    case 'set':
      return {
        ...state,
        ...action.payload,
      }
    case 'reset':
      return {
        ...action.payload,
      }
    default:
      throw new Error('unknown action type')
  }
}

const useForm: UseForm = <T extends {}>(initialState: T, useFormOpt = {}) => {
  const [formState, dispatch] = useReducer<Reducer<T, Action<T>>>(
    reducer,
    initialState
  )
  const setFormState = (data: Partial<T>) =>
    dispatch({
      type: 'set',
      payload: data,
    })
  const reset = (data: T = initialState) =>
    dispatch({
      type: 'reset',
      payload: data,
    })

  const bindField = useField<T>(formState, setFormState, useFormOpt)

  const initialStateSign = JSON.stringify(initialState)
  useEffect(() => {
    if (JSON.stringify(formState) !== initialStateSign) {
      reset()
    }
  }, [initialStateSign])

  return [
    formState,
    bindField,
    {
      setFormState,
      reset,
    },
  ]
}

export default useForm
