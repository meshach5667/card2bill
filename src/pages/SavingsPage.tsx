import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Badge,
  styled,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Groups as GroupsIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -10,
    top: 13,
    padding: '0 4px',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const SavingsOverview = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Mock data - replace with real data from your API/state
  const savingsData = {
    totalSavings: 0,
    expectedInterest: 0,
    activePlans: 0
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header with Coming Soon badge */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4 
      }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
          Your Savings
        </Typography>
        <StyledBadge badgeContent={<InfoIcon fontSize="small" />}>
          <Typography variant="caption" color="text.secondary">
            Coming Soon
          </Typography>
        </StyledBadge>
      </Box>

      {/* Cards Layout using Box */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Total Savings Card */}
        <Box sx={{ flex: '1 1 100%', maxWidth: 'calc(33.333% - 24px)', md: { maxWidth: 'calc(33.333% - 24px)' } }}>
          <motion.div whileHover={{ y: -5 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: '100%',
                background: 'linear-gradient(135deg, rgba(98, 12, 144, 0.1) 0%, rgba(58, 66, 225, 0.1) 100%)',
                borderRadius: 2,
                borderLeft: '4px solid',
                borderColor: 'primary.main'
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <AccountBalanceIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  ₦{savingsData.totalSavings.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Savings
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        </Box>

        {/* Expected Interest Card */}
        <Box sx={{ flex: '1 1 100%', maxWidth: 'calc(33.333% - 24px)', md: { maxWidth: 'calc(33.333% - 24px)' } }}>
          <motion.div whileHover={{ y: -5 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: '100%',
                background: 'linear-gradient(135deg, rgba(58, 66, 225, 0.1) 0%, rgba(25, 118, 210, 0.1) 100%)',
                borderRadius: 2,
                borderLeft: '4px solid',
                borderColor: 'secondary.main'
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <TrendingUpIcon color="secondary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {savingsData.expectedInterest}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Expected Interest
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        </Box>

        {/* Active Plans Card */}
        <Box sx={{ flex: '1 1 100%', maxWidth: 'calc(33.333% - 24px)', md: { maxWidth: 'calc(33.333% - 24px)' } }}>
          <motion.div whileHover={{ y: -5 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: '100%',
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(12, 144, 142, 0.1) 100%)',
                borderRadius: 2,
                borderLeft: '4px solid',
                borderColor: 'info.main'
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <GroupsIcon color="info" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {savingsData.activePlans}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Plans
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        </Box>
      </Box>
    </Container>
  );
};

export default SavingsOverview;