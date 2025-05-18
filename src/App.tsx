import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { useOnboarding } from './hooks/useOnboarding';
import LoadingPage from './pages/LoadingPage';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import CryptoBuy from './components/crypto/CryptoBuy';
import CryptoSell from './components/crypto/CryptoSell';
import HomePage from './pages/HomePage';
import GiftCardsPage from './pages/GiftCardsPage';
import CryptoPage from './pages/CryptoPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import VerificationPage from './pages/VerificationPage';
import OnboardingPage from './pages/OnboardingPage';
// import SavingsPage from './pages/SavingsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';
import { ToastContainer } from 'react-toastify';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6B4DFF',
      dark: '#5B3DFF',
    },
    secondary: {
      main: '#FF4D8C',
    },
  },
});

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { hasSeenOnboarding } = useOnboarding();
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };
  console.log('App rendering - Loading:', isLoading, 'HasSeenOnboarding:', hasSeenOnboarding);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log('Loading complete');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              isLoading ? (
                <LoadingPage />
              ) : (
                <Navigate to={hasSeenOnboarding ? "/login" : "/onboarding"} replace />
              )
            } 
          />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify" element={<VerificationPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/giftcards" element={<GiftCardsPage />} />
          <Route path="/crypto" element={<CryptoPage />} />
          {/* <Route path="/savings" element={<SavingsPage />} /> */}
          <Route path="/crypto/buy" element={<CryptoBuy />} />
          <Route path="/crypto/sell" element={<CryptoSell />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route 
            path="/settings" 
            element={<SettingsPage toggleTheme={toggleTheme} themeMode={themeMode} />} 
          />
          {/* Add more routes as needed */}
          
          {/* Protected Routes */}
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {/* Place ToastContainer here so it's available throughout the app */}
        <ToastContainer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
