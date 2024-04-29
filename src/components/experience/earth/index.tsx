import SPHERE_RADIUS from '@/core/constants/sphere-radius.constant'
import {  useLoader } from '@react-three/fiber'
import * as THREE from 'three'

type EarthProps = {}

function Earth({}: EarthProps) {
    const [colorMap, normalMap, specularMap, cloudsColorMap] = useLoader(
        THREE.TextureLoader,
        [
            '/textures/8k_earth_daymap.jpg',
            '/textures/8k_earth_normal_map.jpg',
            '/textures/8k_earth_specular_map.jpg',
            '/textures/8k_earth_clouds.jpg',
        ]
    )

    return (
        <>
            <mesh>
                <sphereGeometry
                    attach="geometry"
                    args={[SPHERE_RADIUS, 64, 64]}
                />
                <meshPhongMaterial specularMap={specularMap} />
                <meshStandardMaterial map={colorMap} normalMap={normalMap} />
            </mesh>
            <mesh>
                <sphereGeometry
                    attach="geometry"
                    args={[SPHERE_RADIUS + 0.001, 64, 64]}
                />
                <meshPhongMaterial
                    alphaMap={cloudsColorMap}
                    opacity={0.8}
                    transparent
                    map={cloudsColorMap}
                />
            </mesh>
        </>
    )
}

export default Earth
