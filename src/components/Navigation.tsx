import React from 'react';
import { Capacitor } from '@capacitor/core';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  styled,
  useTheme,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
  Drawer,
  IconButton,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

interface MenuItem {
  id: number;
  icon: string;
  label: string;
  path: string;
}

interface NavigationProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  onClose?: () => void;
}

const SideNav = styled(Box)(({ theme }) => ({
  height: '100%',
  width: 240,
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'column',
}));

const NavButton = styled(Button)(({ theme }) => ({
  width: '100%',
  justifyContent: 'flex-start',
  padding: theme.spacing(2, 3),
  borderRadius: 0,
  gap: theme.spacing(1.5),
  textTransform: 'none',
  transition: 'all 0.3s ease',
}));

const BottomNav = styled(BottomNavigation)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'white',
  boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.05)',
  height: 'auto',
  paddingTop: theme.spacing(1),
  paddingBottom: Capacitor.getPlatform() === 'ios' ? theme.spacing(4) : theme.spacing(1),
}));

const Navigation: React.FC<NavigationProps> = ({ mobileOpen, handleDrawerToggle, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token/session here if needed
    localStorage.removeItem('token');
    console.log('Logging out...');
    navigate('/login');
  };

  const menuItems: MenuItem[] = [
    { id: 1, icon: '🏠', label: 'Home', path: '/home' },
    { id: 2, icon: '🎁', label: 'Gift Cards', path: '/giftcards' },
    { id: 3, icon: '₿', label: 'Crypto', path: '/crypto' },
    { id: 4, icon: '📊', label: 'Analytics', path: '/analytics' },
    { id: 5, icon: '💰', label: 'Savings', path: '/savings' },
    { id: 6, icon: '⚙️', label: 'Settings', path: '/settings' },
  ];

  const renderDrawerContent = () => (
    <SideNav>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #620C90 0%, #3A42E1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Card2Bill
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      <Divider />
      
      <Box sx={{ mt: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavButton
              key={item.id}
              onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  handleDrawerToggle();
                  onClose?.();
                }
              }}
              sx={{
                color: isActive ? 'primary.main' : 'text.secondary',
                backgroundColor: isActive ? 'rgba(98, 12, 144, 0.08)' : 'transparent',
                borderRight: isActive ? 4 : 0,
                borderColor: 'primary.main',
                '&:hover': {
                  backgroundColor: isActive 
                    ? 'rgba(98, 12, 144, 0.12)' 
                    : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <Typography variant="h6" component="span">
                {item.icon}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {item.label}
              </Typography>
            </NavButton>
          );
        })}
      </Box>

      {/* Logout Button */}
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          onClick={handleLogout}
          sx={{ textTransform: 'none' }}
        >
          🚪 Logout
        </Button>
      </Box>
    </SideNav>
  );

  if (Capacitor.getPlatform() === 'web') {
    return (
      <>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, position: 'fixed', top: 16, left: 16, zIndex: theme.zIndex.drawer + 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 240,
              ...(isMobile && {
                boxShadow: theme.shadows[3],
              }),
            },
          }}
        >
          {renderDrawerContent()}
        </Drawer>
      </>
    );
  }

  // Mobile Bottom Navigation for Native Platforms
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 30 }}
    >
      <BottomNav showLabels>
        {[...menuItems.slice(0, 3), { id: 999, icon: '🚪', label: 'Logout', path: '/logout' }].map((item) => (
          <BottomNavigationAction
            key={item.id}
            label={item.label}
            icon={
              <Typography variant="h6" component="span">
                {item.icon}
              </Typography>
            }
            onClick={() => {
              if (item.label === 'Logout') {
                handleLogout();
              } else {
                navigate(item.path);
              }
            }}
            sx={{
              color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.75rem',
                fontWeight: 500,
              },
            }}
          />
        ))}
      </BottomNav>
    </motion.div>
  );
};

export default Navigation;
