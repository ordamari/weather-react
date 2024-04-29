import SECOND from '@/core/constants/second.constant'
import Effect from '@/core/types/effect.type'
import easingEffects from '@/lib/easingEffects'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type Options = {
    duration: number
    effect: Effect
    doneCallback?: () => void
    stepCallback?: (value: number) => void
}

type UseNumberWithTransitionReturn = [
    number,
    (newValue: number | ((prev: number) => number)) => void,
    {
        targetValue: number
        isTransitioning: boolean
    }
]

function useNumberWithTransition(
    initialValue: number = 0,
    options?: Partial<Options>
): UseNumberWithTransitionReturn {
    const settings: Options = useMemo(() => {
        return {
            duration: SECOND,
            effect: 'linear',
            ...options,
        }
    }, [options])

    const easing = useCallback(
        (x: number) => easingEffects(x, settings.effect),
        [settings.effect]
    )

    const [targetValue, setTargetValue] = useState(initialValue)
    const [value, setValue] = useState(initialValue)
    const timeOutRef = useRef<NodeJS.Timeout>()
    const valueRef = useRef(initialValue)
    const from = useRef(initialValue)
    const distance = useRef(0)
    const startTime = useRef<number>()

    const onFrame = () => {
        // time elapsed since start of transition
        const elapsed = Date.now() - startTime.current!

        // total distance between start and target value

        // distance traveled so far between start and target value
        const traveled = (distance.current / settings.duration) * elapsed

        // percentage traveled so far
        const percentage = (100 / distance.current) * traveled

        // factor (between 0 - 1) traveled so far
        const factor = percentage / 100

        // elapsed may be greater than duration which can happen if animationFrame/loop 'overshoots' duration time (it fires async after all)
        const isFinished = elapsed >= settings.duration

        const newEasedValue = isFinished
            ? targetValue
            : from.current + easing(factor) * distance.current

        valueRef.current = newEasedValue
        setValue(newEasedValue)
        if (settings.stepCallback) {
            settings.stepCallback(newEasedValue)
        }

        if (isFinished) {
            if (settings.doneCallback) {
                settings.doneCallback()
            }
        }
    }

    useEffect(() => {
        if (value === targetValue) {
            if (timeOutRef.current) clearTimeout(timeOutRef.current)
            return
        }
        timeOutRef.current = setInterval(onFrame, 20)
        return () => {
            if (timeOutRef.current) clearInterval(timeOutRef.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetValue, value])

    const set = useCallback((newValue: number | ((prev: number) => number)) => {
        setTargetValue((prev) => {
            const next =
                typeof newValue === 'function' ? newValue(prev) : newValue
            from.current = valueRef.current
            distance.current = next - from.current
            startTime.current = Date.now()
            return next
        })
    }, [])

    const isTransitioning = useMemo(
        () => value !== targetValue,
        [value, targetValue]
    )

    return [value, set, { targetValue, isTransitioning }]
}

export default useNumberWithTransition
