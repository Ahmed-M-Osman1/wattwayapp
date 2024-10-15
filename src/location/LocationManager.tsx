import { Platform } from 'react-native';

export default class LocationManager {
    private static instance: LocationManager;

    // Static fixed location that will be returned for both Android and iOS
    private static fixedLocation = {
        longitude:  7.2857311,
        latitude: 43.7131659,
        latitudeDelta: 0.2246253528461608,
        longitudeDelta: 0.1599987968802452,
        accuracy: 0,
        altitude: 0,
        heading: 0,
        speed: 0,
        timestamp: Date.now(),
    };

    // Private constructor to prevent direct instantiation
    private constructor() {}

    // Get the singleton instance of LocationManager
    public static getInstance(): LocationManager {
        if (!LocationManager.instance) {
            LocationManager.instance = new LocationManager();
        }
        return LocationManager.instance;
    }

    // Start listening for location updates (dummy method, no functionality)
    public startListening() {
        // No operation: we are returning a static location only
    }

    // Stop listening for location updates (dummy method, no functionality)
    public stopListening() {
        // No operation: we are returning a static location only
    }

    // Return the static location
    public getLocation() {
        return LocationManager.fixedLocation;
    }
}
