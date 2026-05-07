import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const PageHeader = ({ title, subtitle, breadcrumbs = [], action }) => (
  <Box mb={3}>
    {breadcrumbs.length > 0 && (
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 1 }}
      >
        {breadcrumbs.map((b, i) => (
          i < breadcrumbs.length - 1
            ? <Link key={i} underline="hover" color="text.secondary" href={b.href} sx={{ fontSize: 12 }}>{b.label}</Link>
            : <Typography key={i} color="text.primary" sx={{ fontSize: 12 }}>{b.label}</Typography>
        ))}
      </Breadcrumbs>
    )}
    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={2}>
      <Box>
        <Typography variant="h4" fontWeight={700} lineHeight={1.2}>{title}</Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" mt={0.5}>{subtitle}</Typography>
        )}
      </Box>
      {action && <Box flexShrink={0}>{action}</Box>}
    </Box>
  </Box>
);

export default PageHeader;
