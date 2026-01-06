/**
 * Station entity representing a train station
 */
export interface Station {
   id: number;
   name: string;
   city: string;
   lat: number;
   lng: number;
}

/**
 * Raw API response shape before normalization
 */
export interface StationApiResponse {
   id: number;
   name: string;
   city: string;
   lat: number;
   lng: number;
}

/**
 * Application state interface
 */
export interface StationsState {
   stations: Station[];
   filteredStations: Station[];
   cityFilter: string;
   selectedStationId: number | null;
   isLoading: boolean;
   error: string | null;
}

/**
 * Actions for state reducer
 */
export type StationsAction =
   | { type: "SET_LOADING" }
   | { type: "SET_STATIONS"; payload: Station[] }
   | { type: "SET_ERROR"; payload: string }
   | { type: "SET_FILTER"; payload: string }
   | { type: "SELECT_STATION"; payload: number | null }
   | { type: "CLEAR_SELECTION" };
