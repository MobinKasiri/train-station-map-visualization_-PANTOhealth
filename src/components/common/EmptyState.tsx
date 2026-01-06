import { Box, Typography } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';

interface EmptyStateProps {
  filter: string;
}

export function EmptyState({ filter }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
        textAlign: 'center',
      }}
    >
      <SearchOffIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
      <Typography variant="subtitle1" gutterBottom>
        No stations found
      </Typography>
      <Typography variant="body2" color="text.secondary">
        No stations match "{filter}"
      </Typography>
    </Box>
  );
}
