import { useEffect } from "react";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { StationsProvider } from "@/context/StationsContext";
import { useStations } from "@/hooks/useStations";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { StationsMap } from "@/components/Map/StationsMap";

// Custom MUI theme with clean, minimal styling
const theme = createTheme({
   palette: {
      primary: {
         main: "#1976d2",
         50: "#e3f2fd",
      },
      background: {
         default: "#fafafa",
         paper: "#ffffff",
      },
   },
   typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
   },
   components: {
      MuiButton: {
         styleOverrides: {
            root: {
               textTransform: "none",
               borderRadius: 8,
            },
         },
      },
   },
});

/**
 * Main application content
 * Separated to use hooks within provider
 */
function AppContent() {
   const { actions } = useStations();

   useEffect(() => {
      actions.loadStations();
   }, [actions]);

   return (
      <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
         <Sidebar />
         <StationsMap />
      </Box>
   );
}

/**
 * Root App component with providers
 */
export function App() {
   return (
      <ThemeProvider theme={theme}>
         <CssBaseline />
         <StationsProvider>
            <AppContent />
         </StationsProvider>
      </ThemeProvider>
   );
}

export default App;
