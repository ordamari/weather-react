import CAMERA_RADIUS from '@/core/constants/camera-radius.constant'
import LocationService from '@/core/services/location.service'
import useLocationStore from '@/core/store/location.store'
import Location from '@/core/types/location.type'
import useCameraPosition from '@/hooks/use-camera-position'
import { Stars } from '@react-three/drei'
import { useCallback, useEffect, useMemo } from 'react'
import Earth from './earth'

function Experience() {
    const [setPoint] = useCameraPosition()
    const location = useLocationStore((state) => state.location)

    const lookAtLocation = useCallback((location: Location) => {
        const point = LocationService.getLocationPoint(location, CAMERA_RADIUS)
        setPoint(point)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (location) lookAtLocation(location)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location])

    const RenderExperience = useMemo(() => {
        return (
            <>
                <Stars
                    radius={CAMERA_RADIUS}
                    depth={50}
                    count={5000}
                    factor={4}
                    saturation={0}
                    fade
                    speed={1}
                />
                <ambientLight intensity={1} />
                <Earth />
            </>
        )
    }, [])

    return RenderExperience
}

export default Experience
