import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
  styled,
  Paper,
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
} from "@mui/material";
import { Grid, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import Navigation from "../components/Navigation"; // Assuming you'll create this similar to the Tailwind version

// Define type interfaces
type FeatureItem = {
  id: number;
  icon: string;
  description: string;
};

interface StatsItem {
  id: number;
  label: string;
  amount?: number;
  count?: number;
  icon: string;
  trend: string;
}

interface QuickLink {
  id: number;
  icon: string;
  label: string;
}

interface VerificationItem {
  id: number;
  label: string;
  progress: number;
}

interface Transaction {
  id: number;
  type: string;
  amount: number;
  date: string;
  icon: string;
}

interface Provider {
  id: number;
  provider: string;
  icon: string;
}

interface BillOptionsType {
  [key: string]: Provider[];
}

const MainContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  maxWidth: "1200px !important",
  [theme.breakpoints.up("md")]: {
    marginLeft: 240,
    width: `calc(100% - 240px)`,
  },
  [theme.breakpoints.down("md")]: {
    marginLeft: 0,
    width: "100%",
    paddingBottom: theme.spacing(10), // Space for bottom navigation
  },
}));

const BottomNav = styled(BottomNavigation)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
  zIndex: theme.zIndex.appBar,
  borderTop: `1px solid ${theme.palette.divider}`,
  height: "auto",
  padding: theme.spacing(1),
}));

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 400 },
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const HomePage: React.FC = () => {
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [currentMessage, setCurrentMessage] = useState<number>(0);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // New state variables for modals
  const [addMoneyOpen, setAddMoneyOpen] = useState<boolean>(false);
  const [withdrawOpen, setWithdrawOpen] = useState<boolean>(false);
  const [billPaymentOpen, setBillPaymentOpen] = useState<boolean>(false);
  const [currentBillType, setCurrentBillType] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const balance: number = 250000.0;
  const savingsBalance: number = 50000.0;
  const cryptoBalance: number = 25000.0;

  // Mock account details
  const accountDetails = {
    number: "9876543210",
    name: "John Doe",
    bank: "ABC Bank",
  };

  const stats: StatsItem[] = [
    {
      id: 1,
      label: "Total Savings",
      amount: savingsBalance,
      icon: "💰",
      trend: "+12.5%",
    },
    {
      id: 2,
      label: "Crypto Value",
      amount: cryptoBalance,
      icon: "₿",
      trend: "+5.2%",
    },
    { id: 3, label: "Bills Paid", count: 12, icon: "📋", trend: "This Month" },
  ];

  const quickLinks: QuickLink[] = [
    { id: 1, icon: "💳", label: "Cards" },
    { id: 2, icon: "🔄", label: "Transfer" },
    { id: 3, icon: "📱", label: "Airtime" },
    { id: 4, icon: "💡", label: "Bills" },
  ];

  const features: FeatureItem[] = [
    { id: 1, icon: "📱", description: "Airtime" },
    { id: 2, icon: "📶", description: "Data" },
    { id: 3, icon: "🎮", description: "Betting" },
    { id: 4, icon: "⚡", description: "Electricity" },
    { id: 5, icon: "📺", description: "Cable TV" },
    { id: 6, icon: "💰", description: "Saving" },
  ];

  const messages: string[] = [
    "You've earned a bonus!",
    "Link your bank account for rewards.",
    "Secure your account with 2FA.",
    "Track your spending easily!",
  ];

  const [verificationList] = useState<VerificationItem[]>([
    { id: 1, label: "Verify Email", progress: 100 },
    { id: 2, label: "Link Phone Number", progress: 50 },
    { id: 3, label: "Add Bank Account", progress: 0 },
    { id: 4, label: "Set up Security Questions", progress: 0 },
  ]);

  // Bill payment options based on type
  const billOptions: BillOptionsType = {
    Airtime: [
      { id: 1, provider: "MTN", icon: "🟡" },
      { id: 2, provider: "Airtel", icon: "🔴" },
      { id: 3, provider: "Glo", icon: "🟢" },
      { id: 4, provider: "9mobile", icon: "🟢" },
    ],
    Data: [
      { id: 1, provider: "MTN", icon: "🟡" },
      { id: 2, provider: "Airtel", icon: "🔴" },
      { id: 3, provider: "Glo", icon: "🟢" },
      { id: 4, provider: "9mobile", icon: "🟢" },
    ],
    Betting: [
      { id: 1, provider: "Bet9ja", icon: "🎲" },
      { id: 2, provider: "SportyBet", icon: "🎲" },
      { id: 3, provider: "1xBet", icon: "🎲" },
    ],
    Electricity: [
      { id: 1, provider: "EKEDC", icon: "⚡" },
      { id: 2, provider: "IKEDC", icon: "⚡" },
      { id: 3, provider: "AEDC", icon: "⚡" },
    ],
    "Cable TV": [
      { id: 1, provider: "DSTV", icon: "📺" },
      { id: 2, provider: "GOtv", icon: "📺" },
      { id: 3, provider: "StarTimes", icon: "📺" },
    ],
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [messages.length]);

  // Handle wallet account copy
  const handleCopyAccount = (): void => {
    navigator.clipboard.writeText(accountDetails.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle feature click
  const handleFeatureClick = (feature: FeatureItem): void => {
    setCurrentBillType(feature.description);
    setBillPaymentOpen(true);
  };

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen);
  };

  // Map API transactions to our Transaction interface or use defaults
  // If you have an API, fetch and set recentTransactionsData in state; for now, use an empty array as a placeholder
  const recentTransactionsData: any[] = [];

  const recentTransactions: Transaction[] =
    recentTransactionsData.length > 0
      ? recentTransactionsData.map((tx: any) => ({
          id: tx.id || Math.random(),
          type: tx.service_type || "Transaction",
          amount: tx.amount || 0,
          date: new Date(tx.created_at).toLocaleDateString() || "Today",
          icon:
            tx.service_type === "Airtime"
              ? "📱"
              : tx.service_type === "Data"
                ? "📶"
                : tx.service_type === "Electricity"
                  ? "⚡"
                  : "💰",
        }))
      : [
          { id: 1, type: "Airtime", amount: -1000, date: "Today", icon: "📱" },
          {
            id: 2,
            type: "Received",
            amount: 5000,
            date: "Yesterday",
            icon: "💰",
          },
          {
            id: 3,
            type: "Electricity",
            amount: -2000,
            date: "Mar 15",
            icon: "⚡",
          },
        ];

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
      }}
    >
      {/* Mobile Drawer */}
      {isMobile && (
        <>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
            }}
          >
            <Navigation
              onClose={handleDrawerToggle}
              mobileOpen={mobileOpen}
              handleDrawerToggle={handleDrawerToggle}
            />
          </Drawer>
        </>
      )}

      {/* Desktop Navigation */}
      {!isMobile && (
        <Navigation
          mobileOpen={false}
          handleDrawerToggle={() => {}} // Empty function for desktop
        />
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - 240px)` },
          minHeight: "100vh",
        }}
      >
        <MainContainer>
          {/* Enhanced Header with Glass Effect */}
          <Paper
            elevation={0}
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 3,
              background: "linear-gradient(135deg, #620C90 0%, #3A42E1 100%)",
              color: "white",
              padding: 3,
              marginBottom: 3,
            }}
          >
            {/* Backdrop blur effect */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(8px)",
                zIndex: 0,
              }}
            />

            {/* Content */}
            <Box sx={{ position: "relative", zIndex: 1 }}>
              {/* Balance Section */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: 3,
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "rgba(255, 255, 255, 0.8)", marginBottom: 1 }}
                  >
                    Available Balance
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                      {showBalance ? `₦${balance.toLocaleString()}` : "••••••"}
                    </Typography>
                    <IconButton
                      onClick={() => setShowBalance(!showBalance)}
                      sx={{ color: "white" }}
                    >
                      {showBalance ? "👁️" : "👁️‍🗨️"}
                    </IconButton>
                  </Box>
                </Box>

                {/* Header Icons */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <IconButton
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                      },
                    }}
                  >
                    <span role="img" aria-label="stats">
                      📊
                    </span>
                  </IconButton>
                  <IconButton
                    sx={{
                      padding: 0,
                      "&:hover": { opacity: 0.8 },
                    }}
                  >
                    <img
                      src="https://via.placeholder.com/40"
                      alt="Profile"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        border: "2px solid rgba(255, 255, 255, 0.2)",
                      }}
                    />
                  </IconButton>
                </Box>
              </Box>

              {/* Quick Links */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 2,
                  marginBottom: 3,
                }}
              >
                {quickLinks.map((link) => (
                  <Button
                    key={link.id}
                    sx={{
                      flexDirection: "column",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      color: "white",
                      padding: 2,
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                      },
                      transition: "transform 0.2s",
                      "&:active": { transform: "scale(0.95)" },
                    }}
                  >
                    <Typography variant="h5" sx={{ marginBottom: 1 }}>
                      {link.icon}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "white" }}>
                      {link.label}
                    </Typography>
                  </Button>
                ))}
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setAddMoneyOpen(true)}
                  sx={{
                    backgroundColor: "white",
                    color: "primary.main",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
                    transition: "transform 0.2s",
                    "&:active": { transform: "scale(0.95)" },
                  }}
                >
                  Add Money
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setWithdrawOpen(true)}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
                    transition: "transform 0.2s",
                    "&:active": { transform: "scale(0.95)" },
                  }}
                >
                  Withdraw
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Stats Overview */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2,
              marginBottom: 3,
            }}
          >
            {stats.map((stat) => (
              <Paper
                key={stat.id}
                elevation={1}
                sx={{
                  padding: 2,
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 1,
                  }}
                >
                  <Typography variant="h5">{stat.icon}</Typography>
                  <Typography variant="caption" sx={{ color: "green.500" }}>
                    {stat.trend}
                  </Typography>
                </Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "text.secondary" }}
                >
                  {stat.label}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {stat.amount
                    ? `₦${stat.amount.toLocaleString()}`
                    : stat.count}
                </Typography>
              </Paper>
            ))}
          </Box>

          {/* Quick Actions */}
          <Paper
            elevation={1}
            sx={{
              borderRadius: 2,
              padding: 3,
              marginBottom: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 2,
              }}
            >
              <Typography variant="h6">Quick Actions</Typography>
              <Button variant="text" color="primary">
                See All
              </Button>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 2,
              }}
            >
              {features.slice(0, 4).map((feature) => (
                <Button
                  key={feature.id}
                  onClick={() => handleFeatureClick(feature)}
                  sx={{
                    flexDirection: "column",
                    backgroundColor: "transparent",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
                    padding: 2,
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      background:
                        "linear-gradient(135deg, rgba(98, 12, 144, 0.1) 0%, rgba(58, 66, 225, 0.1) 100%)",
                      borderRadius: 2,
                      width: 64,
                      height: 64,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 1,
                    }}
                  >
                    <Typography variant="h4">{feature.icon}</Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {feature.description}
                  </Typography>
                </Button>
              ))}
            </Box>
          </Paper>

          {/* Notification */}
          <Paper
            elevation={1}
            sx={{
              borderRadius: 2,
              padding: 2,
              marginBottom: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                backgroundColor: "primary.light",
                borderRadius: "50%",
                width: 40,
                height: 40,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h5">🔔</Typography>
            </Box>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {messages[currentMessage]}
            </Typography>
          </Paper>

          {/* Verification Progress */}
          <Paper
            elevation={1}
            sx={{
              borderRadius: 2,
              padding: 3,
              marginBottom: 3,
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Verification Progress
            </Typography>
            {verificationList.map((item) => (
              <Box key={item.id} sx={{ marginBottom: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 1,
                  }}
                >
                  <Typography variant="caption">{item.label}</Typography>
                  <Typography variant="caption" color="primary">
                    {item.progress}%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 8,
                    backgroundColor: "grey.200",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: `${item.progress}%`,
                      background: "linear-gradient(135deg, #620C90, #3A42E1)",
                      transition: "width 0.7s ease-out",
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Paper>

          {/* Recent Transactions */}
          <Paper
            elevation={1}
            sx={{
              borderRadius: 2,
              padding: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 2,
              }}
            >
              <Typography variant="h6">Recent Transactions</Typography>
              <Button variant="text" color="primary">
                View All
              </Button>
            </Box>
            {recentTransactions.map((tx) => (
              <Box
                key={tx.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 2,
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "grey.100" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: tx.amount > 0 ? "green.100" : "grey.100",
                    }}
                  >
                    <Typography variant="h5">{tx.icon}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                      {tx.type}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {tx.date}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "medium",
                    color: tx.amount > 0 ? "green.600" : "text.primary",
                  }}
                >
                  {tx.amount > 0 ? "+" : ""}
                  {tx.amount.toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Paper>
        </MainContainer>
      </Box>

      {/* Bottom Navigation for Mobile */}
      {isMobile && (
        <BottomNav showLabels>
          {[
            { label: "Home", icon: "🏠" },
            { label: "Cards", icon: "💳" },
            { label: "Crypto", icon: "₿" },
            { label: "Savings", icon: "💰" },
          ].map((item) => (
            <BottomNavigationAction
              key={item.label}
              label={item.label}
              icon={<Typography variant="h5">{item.icon}</Typography>}
            />
          ))}
        </BottomNav>
      )}

      {/* Add Money Modal */}
      <Modal
        open={addMoneyOpen}
        onClose={() => setAddMoneyOpen(false)}
        aria-labelledby="add-money-modal-title"
      >
        <Box sx={modalStyle}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography id="add-money-modal-title" variant="h6" component="h2">
              Add Money to Wallet
            </Typography>
            <IconButton onClick={() => setAddMoneyOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Transfer to the account details below:
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 3,
              backgroundColor: "rgba(98, 12, 144, 0.05)",
              borderRadius: 2,
            }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2">Account Number</Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body1" sx={{ fontWeight: "bold", mr: 1 }}>
                  {accountDetails.number}
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleCopyAccount}
                  color={copied ? "success" : "default"}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2">Account Name</Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {accountDetails.name}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2">Bank</Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {accountDetails.bank}
              </Typography>
            </Box>
          </Paper>

          <Typography
            variant="caption"
            sx={{ color: "text.secondary", display: "block", mb: 2 }}
          >
            Funds will be credited to your wallet instantly after transfer.
          </Typography>

          <Button
            fullWidth
            variant="contained"
            onClick={() => setAddMoneyOpen(false)}
            sx={{
              background: "linear-gradient(135deg, #620C90 0%, #3A42E1 100%)",
              py: 1.5,
            }}
          >
            Got it!
          </Button>
        </Box>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        aria-labelledby="withdraw-modal-title"
      >
        <Box sx={modalStyle}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography id="withdraw-modal-title" variant="h6" component="h2">
              Withdraw Funds
            </Typography>
            <IconButton onClick={() => setWithdrawOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Select Bank
            </Typography>
            <Select defaultValue="" displayEmpty sx={{ borderRadius: 2 }}>
              <MenuItem value="" disabled>
                Select your bank
              </MenuItem>
              <MenuItem value="gtbank">GTBank</MenuItem>
              <MenuItem value="firstbank">First Bank</MenuItem>
              <MenuItem value="zenithbank">Zenith Bank</MenuItem>
              <MenuItem value="accessbank">Access Bank</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Account Number"
            variant="outlined"
            placeholder="Enter 10-digit account number"
            sx={{ mb: 3, borderRadius: 2 }}
          />

          <TextField
            fullWidth
            label="Amount to Withdraw"
            variant="outlined"
            placeholder="Enter amount"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₦</InputAdornment>
              ),
            }}
            sx={{ mb: 3, borderRadius: 2 }}
          />

          <Typography
            variant="caption"
            sx={{ color: "text.secondary", display: "block", mb: 4 }}
          >
            Withdrawal processing time: 5-10 minutes. Fee: ₦100 for amounts over
            ₦10,000.
          </Typography>

          <Button
            fullWidth
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #620C90 0%, #3A42E1 100%)",
              py: 1.5,
            }}
          >
            Withdraw Now
          </Button>
        </Box>
      </Modal>

      {/* Bill Payment Modal */}
      <Dialog
        open={billPaymentOpen}
        onClose={() => setBillPaymentOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">{currentBillType} Payment</Typography>
            <IconButton onClick={() => setBillPaymentOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {currentBillType && billOptions[currentBillType] && (
            <>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Select Provider
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 3,
                }}
              >
                {billOptions[currentBillType].map((provider) => (
                  <Box
                    key={provider.id}
                    sx={{
                      width: {
                        xs: "calc(50% - 8px)",
                        sm: "calc(33.333% - 10.667px)",
                      },
                    }}
                  >
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        py: 3,
                        borderRadius: 2,
                        "&:hover": {
                          backgroundColor: "rgba(98, 12, 144, 0.05)",
                          borderColor: "primary.main",
                        },
                      }}
                    >
                      <Typography variant="h5" sx={{ mb: 1 }}>
                        {provider.icon}
                      </Typography>
                      <Typography variant="body2">
                        {provider.provider}
                      </Typography>
                    </Button>
                  </Box>
                ))}
              </Box>
              <TextField
                fullWidth
                label="Phone Number or Account"
                variant="outlined"
                placeholder={
                  currentBillType === "Electricity"
                    ? "Enter meter number"
                    : currentBillType === "Cable TV"
                      ? "Enter smartcard number"
                      : "Enter phone number"
                }
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Amount"
                variant="outlined"
                placeholder="Enter amount"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₦</InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setBillPaymentOpen(false)}
            sx={{ color: "text.secondary", mr: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #620C90 0%, #3A42E1 100%)",
              px: 4,
            }}
          >
            Pay Now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomePage;
