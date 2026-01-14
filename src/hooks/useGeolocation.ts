import { useState, useEffect } from "react";

const OFFICE_LOCATIONS = [
  { lat: -7.766014943897623, lng: 110.3747460290303 },
  { lat: -7.763926437817317, lng: 110.37274483023641 },
];

const MAX_DISTANCE_METERS = 200;

export function useGeolocation() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [locationError, setLocationError] = useState<string | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isWithinRange, setIsWithinRange] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setLocationError(null);

        // Calculate distance to nearest office
        let minDistance = Infinity;
        OFFICE_LOCATIONS.forEach((office) => {
          const dist = calculateDistance(
            latitude,
            longitude,
            office.lat,
            office.lng
          );
          if (dist < minDistance) minDistance = dist;
        });

        setDistance(minDistance);
        setIsWithinRange(minDistance <= MAX_DISTANCE_METERS);
        setIsLoading(false);
      },
      (error) => {
        setLocationError("Unable to retrieve your location");
        console.error("Geolocation error:", error);
        setIsLoading(false);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return {
    location,
    locationError,
    distance,
    isWithinRange,
    isLoading,
    MAX_DISTANCE_METERS,
  };
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
