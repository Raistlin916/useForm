import React, { useState, useEffect } from 'react'
import { render, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import useForm, { useField } from '../src/useForm'

const NumberInput = ({ value, onChange, targetValue }) => {
  useEffect(() => {
    if (!targetValue) {
      return
    }
    const tid = setTimeout(() => {
      onChange(targetValue)
    }, 150)

    return () => clearTimeout(tid)
  }, [])
  return <input />
}

const TestApp = ({ from, to, propName = 'value' }) => {
  const [value, setValue] = useState({ value: from })
  return (
    <>
      <TestComponent
        name="value"
        value={value}
        onChange={setValue}
        to={to}
        propName={propName}
      />
      <div data-testid="display">{JSON.stringify(value)}</div>
    </>
  )
}

const TestComponent = ({ value, onChange, to, propName }) => {
  const field = useField(value, onChange)
  return field(<NumberInput name={propName} targetValue={to} />)
}

const TestIterateApp = () => {
  const [formState, field] = useForm({ iterateProps: [{ foo: 1 }, { foo: 2 }] })
  return (
    <>
      {field(<TestIterateComponent name="iterateProps" />)}
      <div data-testid="display">{JSON.stringify(formState)}</div>
    </>
  )
}

const TestIterateComponent = ({ value, onChange }) => {
  const field = useField(value, onChange)
  return (
    <>
      {field(<NumberInput name={'0'} />)}
      {field(<NumberInput name={'1.foo'} targetValue={3} />)}
    </>
  )
}

beforeAll(() => {
  jest.useFakeTimers()
})
afterAll(() => {
  jest.useRealTimers()
})

describe('useField hooks', () => {
  it('array field change correctly', () => {
    const { getByTestId } = render(<TestApp from={[1]} to={[3, 4]} />)
    expect(getByTestId('display')).toHaveTextContent('{"value":[1]}')
    act(() => jest.runAllTimers())
    expect(getByTestId('display')).toHaveTextContent('{"value":[3,4]}')
  })

  it('object field change correctly', () => {
    const { getByTestId } = render(
      <TestApp from={{ foo: 1 }} to={{ foo: 2 }} />
    )
    expect(getByTestId('display')).toHaveTextContent('{"value":{"foo":1}}')
    act(() => jest.runAllTimers())
    expect(getByTestId('display')).toHaveTextContent('{"value":{"foo":2}}')
  })

  it('deep path object change correctly', () => {
    const { getByTestId } = render(
      <TestApp from={1} to={2} propName="value.bar" />
    )
    expect(getByTestId('display')).toHaveTextContent('{"value":1}')
    act(() => jest.runAllTimers())
    expect(getByTestId('display')).toHaveTextContent('{"value":{"bar":2}}')
  })

  it('iterate field change correctly', () => {
    const { getByTestId } = render(<TestIterateApp />)
    expect(getByTestId('display')).toHaveTextContent(
      '{"iterateProps":[{"foo":1},{"foo":2}]}'
    )
    act(() => jest.runAllTimers())
    expect(getByTestId('display')).toHaveTextContent(
      '{"iterateProps":[{"foo":1},{"foo":3}]'
    )
  })
})
