import React, { useState } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, IconButton, InputAdornment, useTheme, useMediaQuery, Link, Checkbox, FormControlLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signUp } from '../api';

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#ffffff',
  padding: theme.spacing(2),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 450,
  background: '#ffffff',
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  color: '#000000',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  input: {
    color: '#000',
    '::placeholder': {
      color: '#888',
      opacity: 1,
    },
  },
  label: {
    color: '#666',
  },
  '& label.Mui-focused': {
    color: '#6B4DFF',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ccc',
    },
    '&:hover fieldset': {
      borderColor: '#9B6DFF',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#9B6DFF',
    },
  },
}));

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }
    try {
      const response = await signUp(formData.email, formData.fullName, formData.password);
      toast.success('Account created successfully');
      navigate('/verify-email', { state: { email: formData.email } });
    }
    catch (error) {
      if (typeof error === 'string') {
        toast.error(error);
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }


  };

  return (
    <StyledContainer maxWidth={false}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StyledPaper elevation={3}>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 700, color: '#6B4DFF' }}>
                Create Account
              </Typography>
              <Typography variant="body2" sx={{ color: '#888' }}>
                Join us and start trading
              </Typography>
            </Box>

            <StyledTextField
              required
              fullWidth
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ color: '#9B6DFF' }} />
                  </InputAdornment>
                ),
              }}
            />

            <StyledTextField
              required
              fullWidth
              label="Email"
              placeholder="Enter your email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ color: '#9B6DFF' }} />
                  </InputAdornment>
                ),
              }}
            />

            <StyledTextField
              required
              fullWidth
              label="Password"
              placeholder="Enter your password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: '#9B6DFF' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOffIcon sx={{ color: '#9B6DFF' }} /> : <VisibilityIcon sx={{ color: '#9B6DFF' }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  sx={{
                    color: '#9B6DFF',
                    '&.Mui-checked': {
                      color: '#9B6DFF',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  I agree to the Terms of Service and Privacy Policy
                </Typography>
              }
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={!acceptedTerms}
              sx={{
                mt: 2,
                height: 48,
                background: 'linear-gradient(90deg, #6B4DFF 0%, #9B6DFF 100%)',
                color: '#fff',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(90deg, #5B3DFF 0%, #8B5DFF 100%)',
                },
                '&:disabled': {
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: '#888',
                },
              }}
            >
              Create Account
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#aaa' }}>
                Already have an account?{' '}
                <Link component="button" variant="body2" onClick={() => navigate('/login')} sx={{ color: '#9B6DFF' }}>
                  Login
                </Link>
              </Typography>
            </Box>
          </Box>
        </StyledPaper>
      </motion.div>
      <ToastContainer />
    </StyledContainer>
  );
};

export default SignupPage;
