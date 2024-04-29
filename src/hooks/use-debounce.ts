import SECOND from '@/core/constants/second.constant'
import { useEffect, useRef } from 'react'
import useToggle from './use-toggle'

function useDebounce<T>(
    value: T,
    onChange: (value: T) => void | Promise<void>,
    delay: number = SECOND / 3
) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [isDebounce, toggleIsDebounce] = useToggle()

    useEffect(() => {
        function handleChange(value: T) {
            toggleIsDebounce(true)
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            timeoutRef.current = setTimeout(async () => {
                await onChange(value)
                toggleIsDebounce(false)
            }, delay)
        }

        handleChange(value)

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return isDebounce
}

export default useDebounce
