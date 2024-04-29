import { useEffect, useRef } from 'react'
import useToggle from './use-toggle'

function useIsFocused(ref: React.RefObject<HTMLElement>) {
    const [isFocused, toggleIsFocus] = useToggle()
    const timeOutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const onFocus = () => {
            toggleIsFocus(true)
        }

        const onBlur = () => {
            timeOutRef.current = setTimeout(() => {
                toggleIsFocus(false)
            }, 200)
        }

        const clean = () => {
            if (timeOutRef.current) clearTimeout(timeOutRef.current)
            if (ref.current) {
                ref.current.removeEventListener('focus', onFocus)
                ref.current.removeEventListener('blur', onBlur)
            }
        }

        if (ref.current) {
            const currentRef = ref.current
            currentRef.addEventListener('focus', onFocus)
            currentRef.addEventListener('blur', onBlur)
        }

        return () => {
            clean()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return isFocused
}

export default useIsFocused
