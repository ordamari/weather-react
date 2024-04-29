'use client'
import Experience from '@/components/experience'
import View from '@/components/view'
import INITIAL_CAMERA_POSITION from '@/core/constants/initial-camera-position.constant'
import { Canvas } from '@react-three/fiber'

export default function Home() {
    return (
        <>
            <Canvas
                camera={{
                    position: [
                        INITIAL_CAMERA_POSITION.x,
                        INITIAL_CAMERA_POSITION.y,
                        INITIAL_CAMERA_POSITION.z,
                    ],
                }}
            >
                <Experience />
            </Canvas>
            <View />
        </>
    )
}
