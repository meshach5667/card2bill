import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Link
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { toast } from 'react-toastify';
import { login } from '../api';

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 450,
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: '#000000',
    '& fieldset': {
      borderColor: 'linear-gradient(90deg, #6B4DFF 0%, #9B6DFF 100%)',
    },
    '&:hover fieldset': {
      borderColor: 'linear-gradient(90deg, #6B4DFF 0%, #9B6DFF 100%)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: 'linear-gradient(90deg, #6B4DFF 0%, #9B6DFF 100%)',
  },
  '& .MuiInputAdornment-root': {
    color: 'linear-gradient(90deg, #6B4DFF 0%, #9B6DFF 100%)',
  },
}));

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    login(email, password)
      .then((response) => {
        const { access_token, token_type } = response;
        if (access_token) {
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('token_type', token_type);
          toast.success('Login successful');
          navigate('/home');
        } else {
          toast.error('Login failed');
        }
      })
      .catch((error) => {
        toast.error(error); // Better error handling
      });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin(e);
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
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography
                variant={isMobile ? 'h5' : 'h4'}
                sx={{
                  color: 'linear-gradient(90deg, #6B4DFF 0%, #9B6DFF 100%)',
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Welcome Back
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'linear-gradient(90deg, #6B4DFF 0%, #9B6DFF 100%)' }}
              >
                Enter your credentials to continue
              </Typography>
            </Box>

            <StyledTextField
              required
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />

            <StyledTextField
              required
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'linear-gradient(90deg, #6B4DFF 0%, #9B6DFF 100%)' }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mt: 2,
                height: 48,
                background: 'linear-gradient(90deg, #6B4DFF 0%, #9B6DFF 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #5B3DFF 0%, #8B5DFF 100%)',
                },
              }}
            >
              Login
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/forgot-password')}
                sx={{ color: 'linear-gradient(90deg, #6B4DFF 0%, #9B6DFF 100%)' }}
              >
                Forgot Password?
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/signup')}
                sx={{ color: theme.palette.primary.main }}
              >
                Create Account
              </Link>
            </Box>
          </Box>
        </StyledPaper>
      </motion.div>
    </StyledContainer>
  );
};

export default LoginPage;
