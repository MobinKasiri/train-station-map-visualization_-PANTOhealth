import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useStations } from "@/hooks/useStations";

// Germany center coordinates
const GERMANY_CENTER: L.LatLngExpression = [51.1657, 10.4515];
const DEFAULT_ZOOM = 6;
const SELECTED_ZOOM = 12;

// Custom marker styles
const createMarkerIcon = (isSelected: boolean) => {
   const size = isSelected ? 16 : 10;
   return L.divIcon({
      className: "",
      html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${isSelected ? "#e53935" : "#1976d2"};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      transition: transform 0.15s ease;
      ${isSelected ? "transform: scale(1.2);" : ""}
    "></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
   });
};

export function StationsMap() {
   const { state, actions } = useStations();
   const mapContainerRef = useRef<HTMLDivElement>(null);
   const mapRef = useRef<L.Map | null>(null);
   const markersRef = useRef<Map<string, L.Marker>>(new Map());

   // Initialize map
   useEffect(() => {
      if (!mapContainerRef.current || mapRef.current) return;

      mapRef.current = L.map(mapContainerRef.current, {
         center: GERMANY_CENTER,
         zoom: DEFAULT_ZOOM,
         zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
         attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);

      return () => {
         if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
         }
      };
   }, []);

   // Update markers when filtered stations change
   useEffect(() => {
      const map = mapRef.current;
      if (!map) return;

      // Clear existing markers
      markersRef.current.forEach((marker) => map.removeLayer(marker));
      markersRef.current.clear();

      // Add markers for filtered stations
      state.filteredStations.forEach((station) => {
         const isSelected = station.id === state.selectedStationId;
         const marker = L.marker([station.lat, station.lng], {
            icon: createMarkerIcon(isSelected),
         }).addTo(map);

         marker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif;">
          <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">
            ${station.name}
          </div>
          <div style="font-size: 12px; color: #666;">
            ${station.city}
          </div>
        </div>
      `);

         marker.on("click", () => {
            actions.selectStation(station.id);
         });

         markersRef.current.set(station.id.toString(), marker);
      });

      // Fit bounds if there are stations
      if (state.filteredStations.length > 0) {
         const bounds = L.latLngBounds(
            state.filteredStations.map((s) => [s.lat, s.lng] as L.LatLngTuple)
         );
         map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
      }
   }, [state.filteredStations, actions]);

   // Handle selection changes
   useEffect(() => {
      const map = mapRef.current;
      if (!map) return;

      // Update marker icons
      markersRef.current.forEach((marker, id) => {
         const isSelected = Number(id) === state.selectedStationId;
         marker.setIcon(createMarkerIcon(isSelected));
      });

      // Zoom to selected station
      if (state.selectedStationId) {
         const selectedStation = state.filteredStations.find(
            (s) => s.id === state.selectedStationId
         );

         if (selectedStation) {
            map.flyTo([selectedStation.lat, selectedStation.lng], SELECTED_ZOOM, {
               duration: 0.5,
            });

            const marker = markersRef.current.get(state.selectedStationId.toString());
            marker?.openPopup();
         }
      }
   }, [state.selectedStationId, state.filteredStations]);

   return (
      <Box
         sx={{
            flex: 1,
            position: "relative",
            "& .leaflet-container": {
               height: "100%",
               width: "100%",
            },
         }}
      >
         <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
      </Box>
   );
}
