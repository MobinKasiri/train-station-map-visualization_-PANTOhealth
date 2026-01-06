import { useCallback } from "react";
import { Box } from "@mui/material";
import { useStations } from "@/hooks/useStations";
import { StationItem } from "./StationItem";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";

export function StationsList() {
   const { state, actions } = useStations();

   const handleSelect = useCallback(
      (id: number) => {
         actions.selectStation(id);
      },
      [actions]
   );

   if (state.isLoading) {
      return <LoadingState />;
   }

   if (state.error) {
      return <ErrorState message={state.error} onRetry={actions.loadStations} />;
   }

   if (state.filteredStations.length === 0) {
      return <EmptyState filter={state.cityFilter} />;
   }

   return (
      <Box
         sx={{
            flex: 1,
            overflowY: "auto",
            py: 1,
         }}
         role="list"
         aria-label="Train stations"
      >
         {state.filteredStations.map((station) => (
            <StationItem
               key={station.id}
               station={station}
               isSelected={state.selectedStationId === station.id}
               onSelect={handleSelect}
            />
         ))}
      </Box>
   );
}
