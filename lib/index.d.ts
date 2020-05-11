import {ReactElement} from "react"

type FieldElem<T> = ReactElement<{
  value?: T
  onChange: (e: Event) => any
}>
type BindField = <E extends FieldElem>(elem: E, bindOpt?: {
  name: string
  valueName?: string
}) => E
type UseFormOpt<S, N extends keyof S> = {
  handleElement?: (elem, fieldValue: S, name: N) => any
  handleOnChanged?: (targetValue: S, name: N, value: S[N]) => S
}

export const useField: <S>(fieldValue: S, onChange: Dispatch<S>, options?: UseFormOpt<S>) =>
  BindField
export const useForm: <S>(initialState: S, useFormOpt?: UseFormOpt<S>) =>
  [S, BindField, {
    setFormState: Dispatch<SetStateAction<S>>,
    reset: () => void
  }]

export default useForm
