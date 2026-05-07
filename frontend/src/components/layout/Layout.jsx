import React, { useState } from 'react';
import {
  Box, AppBar, Toolbar, Typography, IconButton,
  Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Divider, useMediaQuery, useTheme, Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TableChartIcon from '@mui/icons-material/TableChart';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useNavigate, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 220;

const NAV_ITEMS = [
  { label: 'Dashboard',  icon: <DashboardIcon />,  path: '/' },
  { label: 'Analytics',  icon: <BarChartIcon />,   path: '/analytics' },
  { label: 'Products',   icon: <TableChartIcon />, path: '/products' },
  { label: 'Import Data',icon: <UploadFileIcon />, path: '/upload' },
];

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: 16 }}>R</Avatar>
        <Box>
          <Typography variant="subtitle2" fontWeight={700} lineHeight={1.2}>ReviewIQ</Typography>
          <Typography variant="caption" color="text.secondary">Analytics Dashboard</Typography>
        </Box>
      </Box>
      <Divider sx={{ borderColor: 'rgba(108,99,255,0.15)' }} />
      <List sx={{ px: 1, pt: 1, flexGrow: 1 }}>
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }}
                sx={{
                  borderRadius: 2,
                  bgcolor: active ? 'rgba(108,99,255,0.15)' : 'transparent',
                  color: active ? 'primary.light' : 'text.secondary',
                  '&:hover': { bgcolor: 'rgba(108,99,255,0.1)', color: 'text.primary' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 600 : 400 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
          v1.0.0 · Product Analytics
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar – desktop */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              bgcolor: 'background.paper',
              borderRight: '1px solid rgba(108,99,255,0.12)',
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Drawer – mobile */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              bgcolor: 'background.paper',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Main content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {isMobile && (
          <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid rgba(108,99,255,0.12)' }}>
            <Toolbar variant="dense">
              <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}>
                <MenuIcon />
              </IconButton>
              <Typography variant="subtitle1" fontWeight={700}>ReviewIQ</Typography>
            </Toolbar>
          </AppBar>
        )}
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
