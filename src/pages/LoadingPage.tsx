import React, { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import SavingsIcon from '@mui/icons-material/Savings';
import { keyframes } from '@emotion/react';
import { motion } from 'framer-motion';
import {

  Container,
 
  IconButton,
  Button,
  useTheme,
  useMediaQuery,

  BottomNavigation,
  BottomNavigationAction,
  Drawer,
  Modal,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  
  Divider
} from '@mui/material';
// Enhanced animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const StyledContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3),
  animation: `${fadeIn} 0.8s ease-out`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at top right, rgba(107, 31, 78, 0.2), transparent 70%)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at bottom left, rgba(42, 45, 100, 0.2), transparent 70%)',
  }
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  color: theme.palette.common.white,
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    background: 'rgba(255, 255, 255, 0.15)'
  },
  '& svg': {
    transition: 'all 0.3s ease',
  },
  '&:hover svg': {
    transform: 'scale(1.1)',
    color: theme.palette.secondary.main
  }
}));

const LoadingPage: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          setIsComplete(true);
          return 100;
        }
        const diff = Math.random() * 15;
        return Math.min(oldProgress + diff, 100);
      });
    }, 300);

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <HomeIcon sx={{ fontSize: 40 }} />,
      title: 'Bills & Balance',
      description: 'Manage bills and track your balance'
    },
    {
      icon: <CardGiftcardIcon sx={{ fontSize: 40 }} />,
      title: 'Gift Cards',
      description: 'Buy & sell e-codes and physical cards'
    },
    {
      icon: <CurrencyBitcoinIcon sx={{ fontSize: 40 }} />,
      title: 'Crypto',
      description: 'Trade various cryptocurrencies'
    },
    {
      icon: <SavingsIcon sx={{ fontSize: 40 }} />,
      title: 'Savings',
      description: 'Coming soon'
    }
  ];

  return (
    <StyledContainer>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Typography 
          variant="h1" 
          component="h1" 
          sx={{ 
            fontWeight: 700, 
            color: 'common.black',
            mb: 2,
            textAlign: 'center',
            fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
            textShadow: '0 2px 20px rgba(0,0,0,0.2)',
            letterSpacing: '-0.02em'
          }}
        >
          Card2Bill
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'rgba(255,255,255,0.9)',
            fontWeight: 300,
            letterSpacing: 2,
            textAlign: 'center',
            mb: 6,
            fontSize: { xs: '1rem', sm: '1.2rem' }
          }}
        >
          Your All-in-One Financial Solution
        </Typography>
      </motion.div>

    

      <Box sx={{ width: '80%', maxWidth: 400, mb: 2 }}>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: 'rgba(255,255,255,0.1)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              background: 'linear-gradient(90deg, #8E2DE2, #4A00E0)',
              boxShadow: '0 0 20px rgba(142, 45, 226, 0.4)'
            }
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Typography 
            align="center" 
            sx={{ 
              color: 'common.white', 
              mt: 2,
              fontWeight: 500,
              fontSize: '1rem',
              opacity: 0.9
            }}
          >
            {isComplete ? 'Welcome!' : `Loading ${Math.round(progress)}%`}
          </Typography>
        </motion.div>
      </Box>
    </StyledContainer>
  );
};

export default LoadingPage;