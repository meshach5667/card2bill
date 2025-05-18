import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Illustrations } from '../constants/illustrations';

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  background: theme.palette.background.default,
  position: 'relative',
  overflow: 'hidden',
}));

const StyledCard = styled(Paper)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 800,
  minHeight: 500,
  background: theme.palette.background.paper,
  borderRadius: theme.spacing(3),
  overflow: 'hidden',
  boxShadow: theme.shadows[5],
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    minHeight: '70vh',
    maxHeight: '90vh',
  }
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(2),
  }
}));

const ProgressDot = styled('div', {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'color'
})<{ active?: boolean; color?: string }>(({ theme, active, color }) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: active ? color : theme.palette.action.disabledBackground,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: active ? 'none' : 'scale(1.2)',
  }
}));

const IllustrationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  flex: 1,
  '& svg': {
    maxWidth: '100%',
    height: 'auto',
    maxHeight: 300, // Default height
    [theme.breakpoints.down('sm')]: {
      maxHeight: 200, // Mobile height
    },
    color: theme.palette.primary.main,
    transition: 'all 0.3s ease',
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  minWidth: 44,
  height: 44,
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: 500,
  cursor: 'pointer',
  userSelect: 'none',
  WebkitTapHighlightColor: 'transparent',
  '&:active': {
    transform: 'scale(0.98)',
  },
}));

const OnboardingPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const steps = [
    {
      title: 'Welcome to Card2Bill',
      description: 'Experience seamless digital transactions with our all-in-one platform.',
      illustration: Illustrations.welcome,
      color: theme.palette.primary.main
    },
    {
      title: 'Gift Card Trading',
      description: 'Buy and sell gift cards instantly with competitive rates.',
      illustration: Illustrations.giftCard,
      color: theme.palette.secondary.main
    },
    {
      title: 'Crypto Exchange',
      description: 'Access multiple cryptocurrencies with real-time rates.',
      illustration: Illustrations.crypto,
      color: theme.palette.info.main
    },
    {
      title: 'Secure & Protected',
      description: 'Your transactions are protected with advanced encryption.',
      illustration: Illustrations.security,
      color: theme.palette.success.main
    }
  ];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      setTimeout(() => {
        navigate('/login');
      }, 300);
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    setTimeout(() => {
      navigate('/login');
    }, 300);
  };

  const currentStep = steps[activeStep];

  return (
    <StyledContainer>
      <StyledCard>
        <Box
          component={motion.div}
          key={activeStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ height: '100%' }}
        >
          <ContentWrapper>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant={isMobile ? 'h5' : 'h4'}
                sx={{ mb: 1, fontWeight: 600 }}
                color="text.primary"
              >
                {currentStep.title}
              </Typography>
              <Typography
                variant={isMobile ? 'body2' : 'body1'}
                sx={{ mb: 2 }}
                color="text.secondary"
              >
                {currentStep.description}
              </Typography>
            </Box>

            <IllustrationContainer>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {currentStep.illustration}
              </motion.div>
            </IllustrationContainer>
          </ContentWrapper>
        </Box>

        <Box sx={{
          position: 'absolute',
          bottom: isMobile ? 16 : 32,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: isMobile ? 2 : 4,
          zIndex: 2
        }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {steps.map((_, index) => (
              <ProgressDot
                key={index}
                active={index === activeStep}
                color={steps[index].color}
                onClick={() => setActiveStep(index)}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {activeStep < steps.length - 1 && (
              <StyledButton
                onClick={handleSkip}
                variant="text"
                color="inherit"
              >
                Skip
              </StyledButton>
            )}
            <StyledButton
              onClick={handleNext}
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
            >
              {activeStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </StyledButton>
          </Box>
        </Box>
      </StyledCard>
    </StyledContainer>
  );
};

export default OnboardingPage;