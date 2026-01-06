import { Box, Typography, Divider } from '@mui/material';
import TrainIcon from '@mui/icons-material/Train';
import { CityFilter } from './CityFilter';
import { StationsList } from './StationsList';

const SIDEBAR_WIDTH = 380;

export function Sidebar() {
  return (
    <Box
      component="aside"
      sx={{
        width: SIDEBAR_WIDTH,
        minWidth: SIDEBAR_WIDTH,
        height: '100vh',
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <TrainIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Train Stations
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Germany Railway Network
        </Typography>
      </Box>

      <Divider />

      {/* Filter */}
      <CityFilter />

      {/* Stations List */}
      <StationsList />
    </Box>
  );
}
