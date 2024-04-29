import INITIAL_CAMERA_POSITION from '@/core/constants/initial-camera-position.constant'
import SECOND from '@/core/constants/second.constant'
import Effect from '@/core/types/effect.type'
import Point from '@/core/types/point.type'
import easingEffects from '@/lib/easingEffects'
import equalPoints from '@/lib/equal-points'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type Options = {
    duration: number
    effect: Effect
    doneCallback?: () => void
    stepCallback?: (value: Point) => void
}

type UseBallPointReturn = [
    Point,
    (newValue: Point | ((prev: Point) => Point)) => void,
    {
        targetPoint: Point
        isPointChanging: boolean
    }
]

function useBallPoint(
    initialPoint: Point = INITIAL_CAMERA_POSITION,
    options?: Partial<Options>
): UseBallPointReturn {
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

    const addDistance = useCallback(
        (from: Point, to: Point, distancePercent: number) => {
            const stepDistance = distance.current * distancePercent
            const directionVector: Point = {
                x: to.x - from.x,
                y: to.y - from.y,
                z: to.z - from.z,
            } // direction vector from first to second

            const directionDistance = Math.sqrt(
                directionVector.x * directionVector.x +
                    directionVector.y * directionVector.y +
                    directionVector.z * directionVector.z
            ) // Normalize Direction Vector to get Unit Vector

            const directionUnitVector: Point = {
                x: directionVector.x / directionDistance,
                y: directionVector.y / directionDistance,
                z: directionVector.z / directionDistance,
            } // The added distance for unit vector

            const addedDistance: Point = {
                x: directionUnitVector.x * stepDistance,
                y: directionUnitVector.y * stepDistance,
                z: directionUnitVector.z * stepDistance,
            } // Update the position of the camera

            const newPoint: Point = {
                x: from.x + addedDistance.x,
                y: from.y + addedDistance.y,
                z: from.z + addedDistance.z,
            }

            return newPoint
        },
        []
    )

    const [targetPoint, setTargetPoint] = useState(initialPoint)
    const [point, setPoint] = useState(initialPoint)
    const timeOutRef = useRef<NodeJS.Timeout>()
    const valueRef = useRef(initialPoint)
    const from = useRef(initialPoint)
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

        const newEasedPoint = isFinished
            ? targetPoint
            : addDistance(from.current, targetPoint, easing(factor))

        valueRef.current = newEasedPoint
        setPoint(newEasedPoint)

        if (settings.stepCallback) {
            settings.stepCallback(newEasedPoint)
        }

        if (isFinished) {
            if (settings.doneCallback) {
                settings.doneCallback()
            }
        }
    }

    useEffect(() => {
        if (equalPoints(point, targetPoint)) {
            if (timeOutRef.current) clearTimeout(timeOutRef.current)
            return
        }
        timeOutRef.current = setInterval(onFrame, 10)
        return () => {
            if (timeOutRef.current) clearInterval(timeOutRef.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetPoint, point])

    const set = useCallback((newPoint: Point | ((prev: Point) => Point)) => {
        setTargetPoint((prev) => {
            const next =
                typeof newPoint === 'function' ? newPoint(prev) : newPoint
            from.current = valueRef.current
            distance.current = Math.hypot(
                next.x - from.current.x,
                next.y - from.current.y,
                next.z - from.current.z
            )
            startTime.current = Date.now()
            return next
        })
    }, [])

    const isPointChanging = useMemo(() => {
        return !equalPoints(point, targetPoint)
    }, [targetPoint, point])

    return [point, set, { targetPoint, isPointChanging }]
}

export default useBallPoint
