import { fetchStations, filterStationsByCity } from "@/api/stationsApi";
import { StationsAction, StationsState } from "@/types";
import { createContext, ReactNode, useCallback, useMemo, useReducer } from "react";

/**
 * Initial state for the stations context
 */
const initialState: StationsState = {
   stations: [],
   filteredStations: [],
   cityFilter: "",
   selectedStationId: null,
   isLoading: true,
   error: null,
};

/**
 * Reducer function handling all state transitions
 */
function stationsReducer(state: StationsState, action: StationsAction): StationsState {
   switch (action.type) {
      case "SET_LOADING":
         return { ...state, isLoading: true, error: null };

      case "SET_STATIONS":
         return {
            ...state,
            stations: action.payload,
            filteredStations: action.payload,
            isLoading: false,
            error: null,
         };

      case "SET_ERROR":
         return { ...state, error: action.payload, isLoading: false };

      case "SET_FILTER": {
         const filtered = filterStationsByCity(state.stations, action.payload);
         const selectedStillVisible = filtered.some((s) => s.id === state.selectedStationId);

         return {
            ...state,
            cityFilter: action.payload,
            filteredStations: filtered,
            selectedStationId: selectedStillVisible ? state.selectedStationId : null,
         };
      }

      case "SELECT_STATION":
         return { ...state, selectedStationId: action.payload };

      case "CLEAR_SELECTION":
         return { ...state, selectedStationId: null };

      default:
         return state;
   }
}

/**
 * Context value shape
 */
interface StationsContextValue {
   state: StationsState;
   actions: {
      loadStations: () => Promise<void>;
      setFilter: (filter: string) => void;
      selectStation: (id: number | null) => void;
      clearSelection: () => void;
   };
}

export const StationsContext = createContext<StationsContextValue | null>(null);

interface StationsProviderProps {
   children: ReactNode;
}

/**
 * Provider component for stations state management
 *
 * Architecture Decision: Context + useReducer
 *
 * For this application scope, Context + useReducer provides:
 * - Sufficient capability without external dependencies
 * - Predictable state transitions via reducer
 * - Native React solution (no extra bundle size)
 * - Easy testing and debugging
 *
 * Zustand/Redux would add unnecessary complexity for this use case.
 */
export function StationsProvider({ children }: StationsProviderProps) {
   const [state, dispatch] = useReducer(stationsReducer, initialState);

   const loadStations = useCallback(async () => {
      dispatch({ type: "SET_LOADING" });
      try {
         const stations = await fetchStations();
         dispatch({ type: "SET_STATIONS", payload: stations });
      } catch (err) {
         const message = err instanceof Error ? err.message : "Unknown error";
         dispatch({ type: "SET_ERROR", payload: message });
      }
   }, []);

   const setFilter = useCallback((filter: string) => {
      dispatch({ type: "SET_FILTER", payload: filter });
   }, []);

   const selectStation = useCallback((id: number | null) => {
      dispatch({ type: "SELECT_STATION", payload: id });
   }, []);

   const clearSelection = useCallback(() => {
      dispatch({ type: "CLEAR_SELECTION" });
   }, []);

   const actions = useMemo(
      () => ({
         loadStations,
         setFilter,
         selectStation,
         clearSelection,
      }),
      [loadStations, setFilter, selectStation, clearSelection]
   );

   const value = useMemo(() => ({ state, actions }), [state, actions]);

   return <StationsContext.Provider value={value}>{children}</StationsContext.Provider>;
}
