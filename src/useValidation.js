import React, { useState, useContext, useEffect, useReducer } from 'react'
import { Form as OriginForm } from 'antd'
import _ from 'lodash'

const defaultCtx = { formState: {}, rules: {}, result: {}, effected: false }

const OriginFormItem = OriginForm.Item
const ValidationContext = React.createContext(defaultCtx)
const NestedContext = React.createContext('')
const pathJoin = (...args) => [...args].filter((i) => i).join('.')

const calcRule = async (rule, value, formState, label) => {
  if (!rule) {
    return true
  }
  if (rule.required) {
    if (!value && typeof value !== 'number') {
      return `${label}不能为空`
    }
  }
  if (typeof rule.assert === 'function') {
    const assertResult = await rule.assert(value, formState, label)
    if (typeof assertResult === 'string') {
      return assertResult
    }
  }
  return true
}

const calcAll = (rules, formState) => {
  const result = Object.entries(rules)
    .filter((tuples) => !tuples[1].isDelete)
    .reduce(
      (previous, tuples) => ({
        ...previous,
        [tuples[0]]: calcRule(
          tuples[1],
          _.get(formState, tuples[0]),
          formState,
          tuples[1].label
        ),
      }),
      {}
    )
  const resultTuples = Object.entries(result)
  return Promise.all(resultTuples.map((item) => item[1])).then((values) =>
    values.reduce(
      (pre, cur, index) => ({ ...pre, [resultTuples[index][0]]: cur }),
      result
    )
  )
}

export const FormItem = (props) => {
  const { label, required, children } = props
  const { formState, effected, rules, ruleDispatch } = useContext(
    ValidationContext
  )
  const nestedCtx = useContext(NestedContext)
  const name =
    props.name || pathJoin(nestedCtx, _.get(props, 'children.props.name'))
  const value = _.get(formState, name)

  if (typeof children === 'function') {
    return <OriginFormItem {...props}>{children(useRules())}</OriginFormItem>
  }
  useEffect(() => {
    if (!name) {
      return
    }
    ruleDispatch({
      type: 'set',
      payload: {
        name,
        value: {
          required,
          label,
          isDelete: false,
        },
      },
    })

    return () => {
      ruleDispatch({
        type: 'set',
        payload: {
          name,
          value: { isDelete: true },
        },
      })
    }
  }, [required, label])

  useEffect(() => {
    if (!name) {
      return
    }
    if (!effected) {
      ruleDispatch({
        type: 'calc',
        payload: {
          name,
          result: true,
        },
      })
      return
    }

    ;(async () => {
      const ruleCalcResult = await calcRule(
        rules[name],
        value,
        formState,
        label
      )
      ruleDispatch({
        type: 'calc',
        payload: {
          name,
          result: ruleCalcResult,
        },
      })
    })()
  }, [effected, value, label, required])

  const ruleResult = (rules[name] || {}).result
  const validateResult =
    typeof ruleResult === 'string'
      ? { validateStatus: 'error', help: ruleResult }
      : {}
  return <OriginFormItem {...props} {...validateResult} />
}

function ruleReducer(state, action) {
  const { payload } = action
  switch (action.type) {
    case 'set':
      return {
        ...state,
        [payload.name]: {
          ...state[payload.name],
          ...payload.value,
        },
      }
    case 'calc':
      return {
        ...state,
        [payload.name]: {
          ...state[payload.name],
          result: payload.result,
        },
      }
    case 'calcAll':
      return Object.keys(payload.rules).reduce(
        (previous, current) => ({
          ...previous,
          [current]: {
            ...state[current],
            result: payload.rulesResult[current],
          },
        }),
        { ...state }
      )
    case 'setAssert':
      return Object.keys(payload).reduce(
        (previous, current) => ({
          ...previous,
          [current]: {
            ...state[current],
            assert: payload[current],
          },
        }),
        { ...state }
      )
    default:
      throw new Error('unknown action')
  }
}

export const Form = ({ name, value, rules = {}, ...props }) => {
  const [ctx, set] = useState(defaultCtx)
  const nestedCtx = useContext(NestedContext)
  const [ctxRules, ruleDispatch] = useReducer(ruleReducer, {})
  const setCtx = (key, v) => set(_.set({ ...ctx }, key, v))

  useEffect(() => {
    if (!ctx.effected || !value) {
      return
    }
    ;(async () => {
      const rulesResult = await calcAll(ctxRules, value)
      ruleDispatch({
        type: 'calcAll',
        payload: {
          rules,
          rulesResult,
        },
      })
    })()
  }, [value, ctx.effected])

  useEffect(() => {
    if (!value) {
      return
    }
    ruleDispatch({
      type: 'setAssert',
      payload: _.pickBy(rules, (v) => typeof v === 'function'),
    })
  }, [
    Object.keys(rules)
      .reduce((pre, key) => (rules[key] ? pre.concat(key) : pre), [])
      .join(),
  ])

  return value ? (
    <ValidationContext.Provider
      value={{
        setCtx,
        ...ctx,
        formState: value,
        rules: ctxRules,
        ruleDispatch,
      }}
    >
      <OriginForm {...props} />
    </ValidationContext.Provider>
  ) : (
    <NestedContext.Provider value={pathJoin(nestedCtx, name)}>
      <OriginForm {...props} />
    </NestedContext.Provider>
  )
}

Form.Item = FormItem

const useRules = () => {
  const { formState, rules, setCtx } = useContext(ValidationContext)
  return {
    async validate() {
      setCtx('effected', true)

      const rulesResult = await calcAll(rules, formState)
      return Object.values(rulesResult).every(
        (item) => typeof item !== 'string'
      )
    },
    reset() {
      setCtx('effected', false)
    },
  }
}
