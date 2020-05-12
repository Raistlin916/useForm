import {ReactElement, SetStateAction, Dispatch} from "react"

type FieldElem = ReactElement<{
  value?: any
  onChange: (e: Event) => any
}>
type BindField = <E extends FieldElem>(elem: E, bindOpt?: {
  name: string
  valueName?: string
}) => E
type UseFormOpt<S> = {
  handleElement?: (elem: FieldElem, fieldValue: S, name: string) => any
  handleOnChanged?: (targetValue: S, name: string, value: any) => S
}

export const useField: <S>(fieldValue: S, onChange: Dispatch<S>, options?: UseFormOpt<S>) =>
  BindField
export const useForm: <S>(initialState: S, useFormOpt?: UseFormOpt<S>) =>
  [S, BindField, {
    setFormState: Dispatch<SetStateAction<S>>,
    reset: () => void
  }]

export default useForm
