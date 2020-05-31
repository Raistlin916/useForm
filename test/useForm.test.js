import React, { useEffect } from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import useForm from '../src/useForm'

const Range = ({ value, onChange }) => {
  useEffect(() => {
    const tid = setTimeout(() => {
      onChange(['3', '4'])
    }, 100)

    return () => clearTimeout(tid)
  }, [])
  return (
    <>
      <input
        data-testid="range1-input"
        name="start"
        value={value[0]}
        onChange={(e) => onChange([e.target.value, value[1]])}
      />
      <input
        data-testid="range0-input"
        name="end"
        value={value[1]}
        onChange={(e) => onChange([value[0], e.target.value])}
      />
    </>
  )
}

const NumberInput = ({ value, onChange }) => {
  useEffect(() => {
    const tid = setTimeout(() => {
      onChange([4, 5, 6])
    }, 150)

    return () => clearTimeout(tid)
  }, [])
  return <input value={value} onChange={onChange} />
}

const TestApp = () => {
  const [formState, bindField, { setFormState }] = useForm({
    username: 'Jay',
    numbers: [1, 2, 3],
    password: 123456,
    start: '0',
    end: '1',
  })
  return (
    <>
      <form data-testid="login-form">
        {bindField(
          <input data-testid="username-input" type="text" name="username" />
        )}
        {bindField(<NumberInput name="numbers" />)}
        {bindField(<input type="text" />, {
          name: 'password',
        })}

        {bindField(<Range name={['start', 'end']} />)}
      </form>
      <div data-testid="display">{formState.username}</div>
      <div data-testid="display-numbers">
        {JSON.stringify(formState.numbers)}
      </div>
      <div data-testid="display-password">{formState.password}</div>
    </>
  )
}

beforeAll(() => {
  jest.useFakeTimers()
})
afterAll(() => {
  jest.useRealTimers()
})

describe('useForm hooks', () => {
  it('form value fullfil correct', () => {
    const { getByTestId } = render(<TestApp />)
    expect(getByTestId('login-form')).toHaveFormValues({
      username: 'Jay',
    })
    expect(getByTestId('display-numbers')).toHaveTextContent('[1,2,3]')
    expect(getByTestId('display-password')).toHaveTextContent(123456)
  })

  it('change input value sync state correct', () => {
    const { getByTestId } = render(<TestApp />)
    fireEvent.change(getByTestId('username-input'), {
      target: { value: 'Eason' },
    })
    expect(getByTestId('display')).toHaveTextContent('Eason')
    expect(getByTestId('login-form')).toHaveFormValues({
      username: 'Eason',
    })
  })

  it('accept multiple names, change callback with array values', () => {
    const { getByTestId } = render(<TestApp />)
    expect(getByTestId('login-form')).toHaveFormValues({
      start: '0',
      end: '1',
    })
    act(() => jest.runAllTimers())

    expect(getByTestId('login-form')).toHaveFormValues({
      start: '3',
      end: '4',
    })
    expect(getByTestId('display-numbers')).toHaveTextContent('[4,5,6]')
  })
})
