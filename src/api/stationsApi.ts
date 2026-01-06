import { Station, StationApiResponse } from "@/types";

const API_URL = "https://gist.githubusercontent.com/neysidev/bbd40032f0f4e167a1e6a8b3e99a490c/raw";

/**
 * Normalizes raw API data to ensure consistent Station structure
 */
function normalizeStation(raw: StationApiResponse): Station {
   return {
      id: raw.id,
      name: raw.name || "Unknown Station",
      city: raw.city || "Unknown City",
      lat: raw.lat || 0,
      lng: raw.lng || 0,
   };
}

/**
 * Fetches all train stations from the API
 */
export async function fetchStations(): Promise<Station[]> {
   const response = await fetch(API_URL);

   if (!response.ok) {
      throw new Error(`Failed to fetch stations: ${response.status}`);
   }

   const data: StationApiResponse[] = await response.json();

   if (!Array.isArray(data)) {
      throw new Error("Invalid data format: expected array");
   }

   return data.map((station) => normalizeStation(station));
}

/**
 * Filters stations by city name (case-insensitive, partial match)
 */
export function filterStationsByCity(stations: Station[], cityFilter: string): Station[] {
   const filter = cityFilter.toLowerCase().trim();

   if (!filter) {
      return stations;
   }

   return stations.filter((station) => station.city.toLowerCase().includes(filter));
}
