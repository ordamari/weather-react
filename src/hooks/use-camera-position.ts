import { useFrame, useThree } from '@react-three/fiber'
import { useCallback, useState } from 'react'
import useBallPoint from './use-ball-point'
import SECOND from '@/core/constants/second.constant'
import Point from '@/core/types/point.type'

function useCameraPosition() {
    const camera = useThree((state) => state.camera)
    const [point, setPoint, { isPointChanging }] = useBallPoint(
        {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z,
        },
        {
            effect: 'ease-in-out',
            duration: SECOND * 2,
        }
    )

    useFrame(() => {
        camera.position.set(point.x, point.y, point.z)
        camera.lookAt(0, 0, 0)
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const set = useCallback((point: Point) => setPoint(point), [])

    return [set, { isPointChanging }] as const
}

export default useCameraPosition
