import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={6} gap={2}>
          <ErrorOutlineIcon sx={{ fontSize: 48, color: 'error.main' }} />
          <Typography variant="h6" color="error">Something went wrong</Typography>
          <Typography variant="body2" color="text.secondary">{this.state.error?.message}</Typography>
          <Button variant="outlined" onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

export const InlineError = ({ message, onRetry }) => (
  <Box display="flex" alignItems="center" gap={1} p={2} sx={{ bgcolor: 'rgba(255,101,132,0.08)', borderRadius: 2, border: '1px solid rgba(255,101,132,0.2)' }}>
    <ErrorOutlineIcon sx={{ color: 'error.main', fontSize: 20 }} />
    <Typography variant="body2" color="error.main" flexGrow={1}>{message}</Typography>
    {onRetry && <Button size="small" color="error" onClick={onRetry}>Retry</Button>}
  </Box>
);

export default ErrorBoundary;
