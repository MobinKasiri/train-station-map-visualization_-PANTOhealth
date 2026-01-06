import { StationsContext } from "@/context/StationsContext";
import { useContext } from "react";

/**
 * Custom hook for accessing stations context
 * Throws if used outside of StationsProvider
 */
export function useStations() {
   const context = useContext(StationsContext);

   if (!context) {
      throw new Error("useStations must be used within a StationsProvider");
   }

   return context;
}
