import { useCallback, useRef } from 'react';
import { Box, TextField, InputAdornment, IconButton, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useStations } from '@/hooks/useStations';

export function CityFilter() {
  const { state, actions } = useStations();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      actions.setFilter(e.target.value);
    },
    [actions]
  );

  const handleClear = useCallback(() => {
    actions.setFilter('');
    inputRef.current?.focus();
  }, [actions]);

  return (
    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
      <TextField
        inputRef={inputRef}
        fullWidth
        size="small"
        placeholder="Search by city..."
        value={state.cityFilter}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
          endAdornment: state.cityFilter && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                edge="end"
                aria-label="Clear filter"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        }}
      />
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        {state.filteredStations.length} of {state.stations.length} stations
      </Typography>
    </Box>
  );
}
