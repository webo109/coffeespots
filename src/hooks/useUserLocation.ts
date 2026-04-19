import { useEffect, useState } from 'react';

export interface UserLocation {
  latitude: number;
  longitude: number;
}

/**
 * Reads the user's current geolocation (one-shot) and caches it in
 * sessionStorage so we don't re-prompt on every render.
 *
 * Silently no-ops if permission is denied or geolocation is unavailable —
 * distance just won't be shown for those users.
 */
export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation | null>(() => {
    try {
      const cached = sessionStorage.getItem('user-location');
      return cached ? (JSON.parse(cached) as UserLocation) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (location) return;
    if (!('geolocation' in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setLocation(next);
        try {
          sessionStorage.setItem('user-location', JSON.stringify(next));
        } catch {
          /* ignore */
        }
      },
      () => {
        /* permission denied or unavailable — silent */
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 }
    );
  }, [location]);

  return location;
}
