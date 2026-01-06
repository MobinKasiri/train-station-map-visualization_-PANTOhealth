import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
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
      <ErrorOutlineIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
      <Typography variant="subtitle1" gutterBottom>
        Failed to load stations
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {message}
      </Typography>
      {onRetry && (
        <Button variant="contained" size="small" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Box>
  );
}
