import { useState } from 'react'

export type Toggle = (value?: any) => void

const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue)

  const toggle = (value: any = null): void => {
    if (typeof value === 'boolean') setValue(value)
    else setValue(prev => !prev)
  }

  return [value, toggle] as const
}

export default useToggle
