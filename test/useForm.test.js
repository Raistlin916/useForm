import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import useForm from '../src/useForm'

const Range = ({ value, onChange }) => {
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

const TestApp = () => {
  const [formState, bindField] = useForm({
    username: 'Jay',
    start: '0',
    end: '1',
  })

  return (
    <>
      <form data-testid="login-form">
        {bindField(
          <input data-testid="username-input" type="text" name="username" />
        )}

        {bindField(<Range name={['start', 'end']} />)}
      </form>
      <div data-testid="display">{formState.username}</div>
    </>
  )
}

describe('useForm hooks', () => {
  it('form value fullfil correct', () => {
    const { getByTestId } = render(<TestApp />)
    expect(getByTestId('login-form')).toHaveFormValues({
      username: 'Jay',
    })
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
  })
})
