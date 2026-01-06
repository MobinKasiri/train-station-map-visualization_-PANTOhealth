import { memo, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Station } from "@/types";

interface StationItemProps {
   station: Station;
   isSelected: boolean;
   onSelect: (id: number) => void;
}

export const StationItem = memo(function StationItem({
   station,
   isSelected,
   onSelect,
}: StationItemProps) {
   const handleClick = useCallback(() => {
      onSelect(station.id);
   }, [station.id, onSelect]);

   const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
         if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(station.id);
         }
      },
      [station.id, onSelect]
   );

   return (
      <Box
         onClick={handleClick}
         onKeyDown={handleKeyDown}
         tabIndex={0}
         role="button"
         aria-pressed={isSelected}
         sx={{
            px: 2,
            py: 1.5,
            cursor: "pointer",
            borderLeft: 3,
            borderColor: isSelected ? "primary.main" : "transparent",
            bgcolor: isSelected ? "primary.50" : "transparent",
            transition: "all 0.15s ease",
            "&:hover": {
               bgcolor: isSelected ? "primary.50" : "grey.50",
            },
            "&:focus": {
               outline: "none",
               bgcolor: isSelected ? "primary.50" : "grey.100",
            },
         }}
      >
         <Typography variant="body2" fontWeight={500} sx={{ mb: 0.25 }}>
            {station.name}
         </Typography>
         <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <LocationOnIcon sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
               {station.city}
            </Typography>
         </Box>
      </Box>
   );
});
