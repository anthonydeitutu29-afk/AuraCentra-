/**
 * Geolocation and Ghana Regional Classification Service
 * Auto-detects user browser coordinates and maps to Ghana's 16 administrative regions.
 */

export interface GhanaRegionInfo {
  id: string;
  name: string;
  capital: string;
  cities: string[];
  centroid: {
    lat: number;
    lng: number;
  };
}

export const GHANA_REGIONS: GhanaRegionInfo[] = [
  {
    id: 'greater-accra',
    name: 'Greater Accra',
    capital: 'Accra',
    cities: ['Accra', 'Tema', 'Madina', 'Spintex', 'East Legon', 'Dansoman', 'Osu', 'Achimota', 'Adenta', 'Kasoa'],
    centroid: { lat: 5.6037, lng: -0.1870 },
  },
  {
    id: 'ashanti',
    name: 'Ashanti',
    capital: 'Kumasi',
    cities: ['Kumasi', 'Obuasi', 'Ejisu', 'Konongo', 'Mampong', 'Asokwa', 'Tafo', 'Suame'],
    centroid: { lat: 6.6885, lng: -1.6244 },
  },
  {
    id: 'western',
    name: 'Western',
    capital: 'Sekondi-Takoradi',
    cities: ['Takoradi', 'Sekondi', 'Tarkwa', 'Axim', 'Elubo', 'Prestea'],
    centroid: { lat: 4.9340, lng: -1.7700 },
  },
  {
    id: 'central',
    name: 'Central',
    capital: 'Cape Coast',
    cities: ['Cape Coast', 'Winneba', 'Mankessim', 'Elmina', 'Kasoa', 'Swedru'],
    centroid: { lat: 5.1053, lng: -1.2466 },
  },
  {
    id: 'eastern',
    name: 'Eastern',
    capital: 'Koforidua',
    cities: ['Koforidua', 'Akosombo', 'Nsawam', 'Nkawkaw', 'Aburi', 'Suhum', 'Oda'],
    centroid: { lat: 6.0784, lng: -0.2588 },
  },
  {
    id: 'volta',
    name: 'Volta',
    capital: 'Ho',
    cities: ['Ho', 'Keta', 'Aflao', 'Hohoe', 'Sogakope', 'Anloga'],
    centroid: { lat: 6.6101, lng: 0.4785 },
  },
  {
    id: 'northern',
    name: 'Northern',
    capital: 'Tamale',
    cities: ['Tamale', 'Yendi', 'Savelugu', 'Bimbilla', 'Kumbungu'],
    centroid: { lat: 9.4008, lng: -0.8393 },
  },
  {
    id: 'upper-east',
    name: 'Upper East',
    capital: 'Bolgatanga',
    cities: ['Bolgatanga', 'Navrongo', 'Bawku', 'Paga', 'Zuarungu'],
    centroid: { lat: 10.7856, lng: -0.8514 },
  },
  {
    id: 'upper-west',
    name: 'Upper West',
    capital: 'Wa',
    cities: ['Wa', 'Lawra', 'Tumu', 'Jirapa', 'Nandom'],
    centroid: { lat: 10.0601, lng: -2.5099 },
  },
  {
    id: 'bono',
    name: 'Bono',
    capital: 'Sunyani',
    cities: ['Sunyani', 'Berekum', 'Dormaa Ahenkro', 'Wenchi'],
    centroid: { lat: 7.3400, lng: -2.3200 },
  },
  {
    id: 'bono-east',
    name: 'Bono East',
    capital: 'Techiman',
    cities: ['Techiman', 'Kintampo', 'Atebubu', 'Nkoranza', 'Yeji'],
    centroid: { lat: 7.5816, lng: -1.9351 },
  },
  {
    id: 'ahafo',
    name: 'Ahafo',
    capital: 'Goaso',
    cities: ['Goaso', 'Duayaw Nkwanta', 'Kenyasi', 'Bechem'],
    centroid: { lat: 7.0000, lng: -2.5000 },
  },
  {
    id: 'western-north',
    name: 'Western North',
    capital: 'Sefwi Wiawso',
    cities: ['Sefwi Wiawso', 'Bibiani', 'Juaboso', 'Enchi', 'Bodi'],
    centroid: { lat: 6.2167, lng: -2.4833 },
  },
  {
    id: 'oti',
    name: 'Oti',
    capital: 'Dambai',
    cities: ['Dambai', 'Nkwanta', 'Jasikan', 'Kadjebi', 'Kete Krachi'],
    centroid: { lat: 7.8833, lng: 0.2000 },
  },
  {
    id: 'savannah',
    name: 'Savannah',
    capital: 'Damongo',
    cities: ['Damongo', 'Bole', 'Salaga', 'Sawla', 'Daboya'],
    centroid: { lat: 9.0833, lng: -1.8167 },
  },
  {
    id: 'north-east',
    name: 'North East',
    capital: 'Nalerigu',
    cities: ['Nalerigu', 'Walewale', 'Gambaga', 'Chereponi', 'Bunkpurugu'],
    centroid: { lat: 10.5333, lng: -0.3667 },
  },
];

/**
 * Calculates Great-Circle distance using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

/**
 * Finds the closest Ghanaian region to given coordinates
 */
export function getClosestGhanaRegion(lat: number, lng: number): {
  region: GhanaRegionInfo;
  distanceKm: number;
} {
  let closest = GHANA_REGIONS[0];
  let minDistance = Infinity;

  for (const reg of GHANA_REGIONS) {
    const dist = calculateDistanceKm(lat, lng, reg.centroid.lat, reg.centroid.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = reg;
    }
  }

  return {
    region: closest,
    distanceKm: minDistance,
  };
}

export interface AutoDetectedLocationResult {
  regionName: string;
  cityName: string;
  coords: {
    lat: number;
    lng: number;
  };
  distanceKm: number;
  isAutomatic: boolean;
  statusMessage: string;
}

/**
 * Executes browser Geolocation API to auto-select the closest region
 */
export function autoDetectUserLocation(): Promise<AutoDetectedLocationResult> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      // Fallback to Greater Accra default
      resolve({
        regionName: 'Greater Accra',
        cityName: 'Accra',
        coords: { lat: 5.6037, lng: -0.1870 },
        distanceKm: 0,
        isAutomatic: false,
        statusMessage: 'Geolocation not supported by browser. Defaulted to Greater Accra.',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const match = getClosestGhanaRegion(latitude, longitude);

        resolve({
          regionName: match.region.name,
          cityName: match.region.capital,
          coords: {
            lat: latitude,
            lng: longitude,
          },
          distanceKm: match.distanceKm,
          isAutomatic: true,
          statusMessage: `Auto-detected closest region: ${match.region.name} (${match.region.capital}).`,
        });
      },
      (error) => {
        console.warn('Geolocation permission or lookup notice:', error.message);
        // Graceful default to national commercial capital Greater Accra
        resolve({
          regionName: 'Greater Accra',
          cityName: 'Accra',
          coords: { lat: 5.6037, lng: -0.1870 },
          distanceKm: 0,
          isAutomatic: false,
          statusMessage: 'Defaulted to Greater Accra hub.',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  });
}
