import LocationService from '../services/location.service'
import CAMERA_RADIUS from './camera-radius.constant'

const NEW_YORK_LOCATION = { latitude: 40.73061, longitude: -73.935242 }

const INITIAL_CAMERA_POSITION = LocationService.getLocationPoint(
    NEW_YORK_LOCATION,
    CAMERA_RADIUS
)

export default INITIAL_CAMERA_POSITION
