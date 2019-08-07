# useForm
React Hook for Form, more simple more power 😌

## Installation

```bash
npm install @uselife/useform
```

## How to use

```javascript
import useForm from '@uselife/useform'

function Page({ classes }) {
  const [formState, bindField] = useForm({
    username: ''
  })
  return (
    <>
      <div>{formState.username}</div>
      <div>{bindField(<input name="username" />)}</div>
    </>
  )
}
```
