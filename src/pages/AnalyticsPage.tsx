import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button
} from '@mui/material';
import {
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  ShoppingCart,
  Sell,
  AccountBalanceWallet,
  TrendingUp,
  TrendingDown,
  Menu as MenuIcon
} from '@mui/icons-material';
import Navigation from '../components/Navigation';

// Types
interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  asset: string;
  amount: number;
  value: number;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
}

interface UserStat {
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
}

// Mock data generation functions
const generateTransactions = (count: number): Transaction[] => {
  const types = ['buy', 'sell'];
  const assets = ['BTC', 'ETH', 'USDT', 'Apple', 'Amazon', 'Google Play'];
  const statuses = ['completed', 'pending', 'failed'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `trans-${i}`,
    type: types[i % 2] as 'buy' | 'sell',
    asset: assets[i % assets.length],
    amount: 10 + (i * 2),
    value: 10000 + (i * 2000),
    date: new Date(Date.now() - (i * 86400000)),
    status: statuses[i % 3] as 'completed' | 'pending' | 'failed'
  }));
};

const generateChartData = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    buy: 50000 + (i * 10000),
    sell: 50000 + (i * 8000),
  }));
};

// Mock data
const transactions = generateTransactions(20).sort((a, b) => b.date.getTime() - a.date.getTime());
const chartData = generateChartData();

const userStats: UserStat[] = [
  {
    label: 'Total Transactions',
    value: transactions.length,
    change: 12.5,
    icon: <ShoppingCart />
  },
  {
    label: 'Total Volume',
    value: `₦${transactions.reduce((sum, t) => sum + t.value, 0).toLocaleString()}`,
    change: 8.2,
    icon: <AccountBalanceWallet />
  },
  {
    label: 'Successful Trades',
    value: transactions.filter(t => t.status === 'completed').length,
    change: 5.7,
    icon: <TrendingUp />
  },
  {
    label: 'Pending Trades',
    value: transactions.filter(t => t.status === 'pending').length,
    change: -2.3,
    icon: <TrendingDown />
  }
];

const AnalyticsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [timeRange, setTimeRange] = useState<string>('6m');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success.main';
      case 'pending': return 'warning.main';
      case 'failed': return 'error.main';
      default: return 'text.primary';
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const now = new Date();
    const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
    return t.date > sixMonthsAgo;
  });

  return (
    <Box sx={{ display: 'flex' }}>
      <Navigation mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - 240px)` },
          ml: { md: '240px' }
        }}
      >
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight="bold">
              Analytics Dashboard
            </Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                label="Time Range"
              >
                <MenuItem value="7d">Last 7 Days</MenuItem>
                <MenuItem value="1m">Last Month</MenuItem>
                <MenuItem value="6m">Last 6 Months</MenuItem>
                <MenuItem value="1y">Last Year</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Stats Cards - Replaced Grid with Flexbox */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3,
            mb: 4,
            '& > *': {
              flex: '1 1 200px',
              minWidth: '200px'
            }
          }}>
            {userStats.map((stat, index) => (
              <Card key={index} sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.light, color: theme.palette.primary.main }}>
                      {stat.icon}
                    </Avatar>
                    <IconButton size="small">
                      <MoreVert />
                    </IconButton>
                  </Box>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ my: 1 }}>
                    {stat.value}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {stat.change > 0 ? (
                      <ArrowUpward color="success" fontSize="small" />
                    ) : (
                      <ArrowDownward color="error" fontSize="small" />
                    )}
                    <Typography
                      variant="body2"
                      color={stat.change > 0 ? 'success.main' : 'error.main'}
                      sx={{ ml: 0.5 }}
                    >
                      {Math.abs(stat.change)}% {stat.change > 0 ? 'increase' : 'decrease'} from last period
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Chart - Removed Recharts dependency */}
          <Card sx={{ mb: 4, p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Trading Volume (₦)
            </Typography>
            <Box sx={{ 
              height: '300px', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              bgcolor: 'background.paper',
              borderRadius: 1
            }}>
              <Typography color="text.secondary">
                Chart visualization would be implemented here
              </Typography>
            </Box>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Recent Transactions</Typography>
              <Button variant="outlined">View All</Button>
            </Box>
            <Divider />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Asset</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Value (₦)</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {transaction.type === 'buy' ? (
                            <ShoppingCart color="success" sx={{ mr: 1 }} />
                          ) : (
                            <Sell color="error" sx={{ mr: 1 }} />
                          )}
                          <Typography textTransform="capitalize">
                            {transaction.type}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{transaction.asset}</TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell>₦{transaction.value.toLocaleString()}</TableCell>
                      <TableCell>
                        {transaction.date.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Typography color={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton>
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default AnalyticsPage;