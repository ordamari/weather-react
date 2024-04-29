import SPHERE_RADIUS from '../constants/sphere-radius.constant'
import Location from '../types/location.type'
import Point from '../types/point.type'

class LocationService {
    static getPointLocation(
        point: Point,
        radius: number = SPHERE_RADIUS
    ): Location {
        const mathPoint = this.toMathPoint(point)
        const latitude = (Math.asin(mathPoint.z / radius) * 180) / Math.PI
        const longitude = (Math.atan2(mathPoint.y, mathPoint.x) * 180) / Math.PI
        return { latitude, longitude }
    }

    static getLocationPoint(
        location: Location,
        radius: number = SPHERE_RADIUS
    ): Point {
        const latRad = (location.latitude * Math.PI) / 180
        const lonRad = (location.longitude * Math.PI) / 180

        const x = radius * Math.cos(latRad) * Math.cos(lonRad)
        const y = radius * Math.cos(latRad) * Math.sin(lonRad)
        const z = radius * Math.sin(latRad)

        return this.toThreePoint({ x, y, z })
    }

    static getGeolocation(): Promise<Location> {
        if (!navigator.geolocation)
            throw new Error('Geolocation is not supported by your browser')
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    })
                },
                (error) => {
                    reject(error)
                }
            )
        })
    }

    private static toMathPoint(point: Point): Point {
        return {
            x: point.x,
            y: -point.z,
            z: point.y,
        }
    }

    private static toThreePoint(point: Point): Point {
        return {
            x: point.x,
            y: point.z,
            z: -point.y,
        }
    }
}

export default LocationService
