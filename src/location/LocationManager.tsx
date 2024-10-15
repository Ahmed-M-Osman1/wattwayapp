import { Platform } from 'react-native';

export default class LocationManager {
    private static instance: LocationManager;

    // Static fixed location that will be returned for both Android and iOS
    private static fixedLocation = {
        latitude: 23.35102681060004,
        longitude: 42.670324109494686,
        latitudeDelta: 0.014298002823881717,
        longitudeDelta: 0.009999945759773254,
        accuracy: 0, // You can add more properties if required
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
