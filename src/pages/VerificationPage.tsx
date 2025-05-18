import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Add StyledContainer component
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #0A1929 0%, #1A1F35 100%)',
  padding: theme.spacing(2),
}));

const OTPInput = styled(TextField)(({ theme }) => ({
  width: '60px',
  height: '60px',
  '& input': {
    textAlign: 'center',
    fontSize: '1.5rem',
    padding: theme.spacing(1),
    color: 'white',
    height: '100%',
  },
  '& .MuiOutlinedInput-root': {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.23)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 450,
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
}));

const VerificationPage: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      if (value && index < 3) {
        const nextInput = document.querySelector(
          `input[name=otp-${index + 1}]`
        ) as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join('');
    console.log('Verifying OTP:', enteredOtp);
    navigate('/login');
  };

  return (
    <StyledContainer maxWidth={false}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StyledPaper elevation={3}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              alignItems: 'center',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography
                variant={isMobile ? 'h5' : 'h4'}
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Verify Your Email
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Enter the 4-digit code sent to your email
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              {otp.map((digit, index) => (
                <OTPInput
                  key={index}
                  inputProps={{
                    maxLength: 1,
                    name: `otp-${index}`,
                  }}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                />
              ))}
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleVerify}
              disabled={otp.some(digit => !digit)}
              sx={{
                mt: 2,
                height: 48,
                background: 'linear-gradient(90deg, #6B4DFF 0%, #9B6DFF 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #5B3DFF 0%, #8B5DFF 100%)',
                },
              }}
            >
              Verify
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Didn't receive the code?{' '}
                <Button
                  variant="text"
                  disabled={timeLeft > 0}
                  onClick={() => setTimeLeft(30)}
                  sx={{ 
                    color: timeLeft > 0 ? 'rgba(255, 255, 255, 0.5)' : theme.palette.primary.main,
                  }}
                >
                  {timeLeft > 0 ? `Resend in ${timeLeft}s` : 'Resend'}
                </Button>
              </Typography>
            </Box>
          </Box>
        </StyledPaper>
      </motion.div>
    </StyledContainer>
  );
};

export default VerificationPage;