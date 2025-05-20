import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Button,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormControlLabel,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  BottomNavigation,
  BottomNavigationAction,
  Chip,
  Avatar,
  Card,
  CardContent,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Alert,
  CircularProgress,
  TextareaAutosize,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import ChatIcon from "@mui/icons-material/Chat";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MenuIcon from "@mui/icons-material/Menu";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SellIcon from "@mui/icons-material/Sell";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";

// Interfaces
interface CryptoAsset {
  value: string;
  label: string;
  icon: string;
  color: string;
  rate: number; // Exchange rate to Naira
}

interface Network {
  value: string;
  label: string;
}

interface NetworkMap {
  [key: string]: Network[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface PaymentDetails {
  asset: string;
  network: string;
  amount: string;
  totalNaira: number;
  comments: string;
  agreedToTerms: boolean;
  confirmedDetails: boolean;
}

interface PaymentMethod {
  id: string;
  label: string;
  icon: string;
  description: string;
  accountDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  supportedCards?: string[];
}

// Helper Components
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ width: "100%" }}>
    {value === index && children}
  </Box>
);

// Styled Components
const MainContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  maxWidth: "1200px !important",
  [theme.breakpoints.up("md")]: {
    marginLeft: 240,
    width: "calc(100% - 240px)",
  },
  [theme.breakpoints.down("md")]: {
    marginLeft: 0,
    width: "100%",
    paddingBottom: theme.spacing(10),
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
  overflow: "visible",
  height: "100%",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
    transform: "translateY(-4px)",
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(90deg, #6B4DFF 0%, #9B6DFF 100%)",
  color: "white",
  borderRadius: theme.spacing(1.5),
  padding: "12px 24px",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "0 4px 14px rgba(107, 77, 255, 0.25)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(90deg, #5B3DFF 0%, #8B5DFF 100%)",
    boxShadow: "0 6px 20px rgba(107, 77, 255, 0.35)",
    transform: "translateY(-2px)",
  },
}));

const OutlinedButton = styled(Button)(({ theme }) => ({
  borderColor: "#6B4DFF",
  color: "#6B4DFF",
  borderRadius: theme.spacing(1.5),
  padding: "12px 24px",
  fontWeight: 600,
  textTransform: "none",
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: "#5B3DFF",
    backgroundColor: "rgba(107, 77, 255, 0.05)",
  },
}));

const StyledBottomNav = styled(BottomNavigation)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "white",
  boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
  zIndex: theme.zIndex.appBar,
  height: 72,
  padding: "8px 0",
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const FloatingChatButton = styled(IconButton)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(10),
  right: theme.spacing(3),
  backgroundColor: "#6B4DFF",
  color: "white",
  boxShadow: "0 4px 14px rgba(107, 77, 255, 0.3)",
  "&:hover": {
    backgroundColor: "#5B3DFF",
  },
  zIndex: 1000,
  padding: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    bottom: theme.spacing(3),
  },
}));

// Data
const cryptoAssets: CryptoAsset[] = [
  {
    value: "BTC",
    label: "Bitcoin (BTC)",
    icon: "₿",
    color: "#F7931A",
    rate: 26500000,
  }, // 1 BTC = ₦26,500,000
  {
    value: "ETH",
    label: "Ethereum (ETH)",
    icon: "Ξ",
    color: "#627EEA",
    rate: 1750000,
  }, // 1 ETH = ₦1,750,000
  {
    value: "USDT",
    label: "Tether (USDT)",
    icon: "₮",
    color: "#26A17B",
    rate: 1575,
  }, // 1 USDT = ₦1,575
];

const networks: NetworkMap = {
  BTC: [{ value: "BTC", label: "Bitcoin Network" }],
  ETH: [
    { value: "ERC20", label: "ERC20 (Ethereum)" },
    { value: "BEP20", label: "BEP20 (BSC)" },
  ],
  USDT: [
    { value: "ERC20", label: "ERC20 (Ethereum)" },
    { value: "TRC20", label: "TRC20 (Tron)" },
    { value: "BEP20", label: "BEP20 (BSC)" },
  ],
};

const valueRanges = {
  BTC: [
    { value: "low", label: "$10 - $1,000", minAmount: 0.0003, maxAmount: 0.03 },
    {
      value: "medium",
      label: "$1,000 - $10,000",
      minAmount: 0.03,
      maxAmount: 0.3,
    },
    { value: "high", label: "$10,000+", minAmount: 0.3, maxAmount: 100 },
  ],
  ETH: [
    { value: "low", label: "$10 - $1,000", minAmount: 0.005, maxAmount: 0.5 },
    {
      value: "medium",
      label: "$1,000 - $10,000",
      minAmount: 0.5,
      maxAmount: 5,
    },
    { value: "high", label: "$10,000+", minAmount: 5, maxAmount: 1000 },
  ],
  USDT: [
    { value: "low", label: "$10 - $1,000", minAmount: 10, maxAmount: 1000 },
    {
      value: "medium",
      label: "$1,000 - $10,000",
      minAmount: 1000,
      maxAmount: 10000,
    },
    { value: "high", label: "$10,000+", minAmount: 10000, maxAmount: 1000000 },
  ],
};

const sellSteps = [
  "Select Asset",
  "Enter Details",
  "Review",
  "Send Crypto",
  "Upload Proof",
];
const buySteps = [
  "Select Asset",
  "Payment Method",
  "Enter Amount",
  "Review",
  "Complete Payment",
];

const paymentMethods = [
  {
    id: "bank",
    label: "Bank Transfer",
    icon: "🏦",
    description: "Transfer directly to our bank account",
    accountDetails: {
      bankName: "First Bank of Nigeria",
      accountNumber: "12345678901",
      accountName: "Crypto Exchange Ltd",
    },
  },
  {
    id: "card",
    label: "Debit/Credit Card",
    icon: "💳",
    description: "Pay securely with your debit or credit card",
    supportedCards: ["Visa", "Mastercard", "Verve"],
  },
];

// Main Component
const CryptoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [transactionCompleted, setTransactionCompleted] = useState(false);
  const [processingTransaction, setProcessingTransaction] = useState(false);

  // Sell Crypto State
  const [sellDetails, setSellDetails] = useState<PaymentDetails>({
    asset: "",
    network: "",
    amount: "",
    totalNaira: 0,
    comments: "",
    agreedToTerms: false,
    confirmedDetails: false,
  });

  // Buy Crypto State
  const [buyDetails, setBuyDetails] = useState({
    asset: "",
    network: "",
    amount: "",
    totalNaira: 0,
    paymentMethod: "",
    comments: "",
    agreedToTerms: false,
    confirmedDetails: false,
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleChatToggle = () => setChatOpen(!chatOpen);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Reset when changing tabs
  useEffect(() => {
    setActiveStep(0);
    setTransactionCompleted(false);
    setPreviewImage(null);
  }, [activeTab]);

  // Handle Sell Details Change
  const handleSellChange =
    (prop: keyof PaymentDetails) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        event.target.type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : event.target.value;

      setSellDetails((prev) => {
        const newDetails = { ...prev, [prop]: value };

        // Calculate total Naira if asset and amount are set
        if (prop === "amount" || prop === "asset") {
          const selectedAsset = cryptoAssets.find(
            (asset) => asset.value === newDetails.asset,
          );
          if (selectedAsset && newDetails.amount) {
            newDetails.totalNaira =
              parseFloat(newDetails.amount) * selectedAsset.rate;
          }
        }

        // Reset network if asset changes
        if (prop === "asset") {
          newDetails.network = "";
        }

        return newDetails;
      });
    };

  // Handle Buy Details Change
  const handleBuyChange =
    (prop: string) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        event.target.type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : event.target.value;

      setBuyDetails((prev) => {
        const newDetails = { ...prev, [prop]: value };

        // Calculate crypto amount if naira amount and asset are set
        if (prop === "totalNaira" || prop === "asset") {
          const selectedAsset = cryptoAssets.find(
            (asset) => asset.value === newDetails.asset,
          );
          if (selectedAsset && newDetails.totalNaira) {
            newDetails.amount = (
              parseFloat(newDetails.totalNaira.toString()) / selectedAsset.rate
            ).toFixed(8);
          }
        }

        // Reset network if asset changes
        if (prop === "asset") {
          newDetails.network = "";
        }

        return newDetails;
      });
    };

  // Handle File Upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Complete Transaction
  const completeTransaction = () => {
    setProcessingTransaction(true);
    // Simulate API request
    setTimeout(() => {
      setProcessingTransaction(false);
      setTransactionCompleted(true);
    }, 2000);
  };

  // Chat Dialog
  const renderChatDialog = () => (
    <Dialog open={chatOpen} onClose={handleChatToggle} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <ChatIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Chat Support</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            p: 2,
            height: "300px",
            backgroundColor: "#f5f5f5",
            borderRadius: 1,
            mb: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Connect with our support team
          </Typography>
        </Box>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button variant="contained" size="small">
                  Send
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleChatToggle}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  // Render Sell Crypto Form
  const renderSellCryptoSteps = () => {
    switch (activeStep) {
      case 0: // Select Asset
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Select Crypto Asset to Sell
            </Typography>
            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
              <InputLabel>Asset</InputLabel>
              <Select
                value={sellDetails.asset}
                onChange={handleSellChange("asset") as any}
                label="Asset"
              >
                {cryptoAssets.map((asset) => (
                  <MenuItem key={asset.value} value={asset.value}>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: asset.color,
                          width: 24,
                          height: 24,
                          mr: 1,
                          fontSize: "0.8rem",
                        }}
                      >
                        {asset.icon}
                      </Avatar>
                      {asset.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {sellDetails.asset && (
              <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
                <InputLabel>Network</InputLabel>
                <Select
                  value={sellDetails.network}
                  onChange={handleSellChange("network") as any}
                  label="Network"
                >
                  {networks[sellDetails.asset]?.map((network) => (
                    <MenuItem key={network.value} value={network.value}>
                      {network.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <GradientButton
                onClick={handleNext}
                disabled={!sellDetails.asset || !sellDetails.network}
              >
                Next <ArrowForwardIcon sx={{ ml: 1 }} />
              </GradientButton>
            </Box>
          </Box>
        );

      case 1: // Enter Details
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Enter Sale Details
            </Typography>

            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
              <TextField
                label="Amount to Sell"
                variant="outlined"
                type="number"
                value={sellDetails.amount}
                onChange={handleSellChange("amount")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {cryptoAssets.find((a) => a.value === sellDetails.asset)
                        ?.icon || ""}
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            {sellDetails.amount && (
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  bgcolor: "rgba(107, 77, 255, 0.05)",
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  You will receive:
                </Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  ₦{sellDetails.totalNaira.toLocaleString("en-NG")}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Rate: ₦
                  {cryptoAssets
                    .find((a) => a.value === sellDetails.asset)
                    ?.rate.toLocaleString("en-NG")}{" "}
                  per {sellDetails.asset}
                </Typography>
              </Box>
            )}

            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
              <TextField
                label="Additional Comments (Optional)"
                variant="outlined"
                multiline
                rows={3}
                value={sellDetails.comments}
                onChange={handleSellChange("comments")}
              />
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  checked={sellDetails.agreedToTerms}
                  onChange={handleSellChange("agreedToTerms")}
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the Terms and Conditions
                </Typography>
              }
              sx={{ mb: 1 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={sellDetails.confirmedDetails}
                  onChange={handleSellChange("confirmedDetails")}
                />
              }
              label={
                <Typography variant="body2">
                  I confirm that all details provided are correct
                </Typography>
              }
            />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <OutlinedButton onClick={handleBack}>
                <ArrowBackIcon sx={{ mr: 1 }} /> Back
              </OutlinedButton>
              <GradientButton
                onClick={handleNext}
                disabled={
                  !sellDetails.amount ||
                  !sellDetails.agreedToTerms ||
                  !sellDetails.confirmedDetails
                }
              >
                Review <ArrowForwardIcon sx={{ ml: 1 }} />
              </GradientButton>
            </Box>
          </Box>
        );

      case 2: // Review
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Sale
            </Typography>

            <StyledCard>
              <CardContent>
                <Stack spacing={2}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Asset
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {
                        cryptoAssets.find((a) => a.value === sellDetails.asset)
                          ?.label
                      }
                    </Typography>
                  </Box>

                  <Divider />

                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Network
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {
                        networks[sellDetails.asset]?.find(
                          (n) => n.value === sellDetails.network,
                        )?.label
                      }
                    </Typography>
                  </Box>

                  <Divider />

                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Amount to Sell
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {sellDetails.amount} {sellDetails.asset}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      You will receive
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="primary"
                    >
                      ₦{sellDetails.totalNaira.toLocaleString("en-NG")}
                    </Typography>
                  </Box>

                  {sellDetails.comments && (
                    <>
                      <Divider />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Comments
                        </Typography>
                        <Typography variant="body2">
                          {sellDetails.comments}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Stack>
              </CardContent>
            </StyledCard>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <OutlinedButton onClick={handleBack}>
                <ArrowBackIcon sx={{ mr: 1 }} /> Back
              </OutlinedButton>
              <GradientButton onClick={handleNext}>
                Confirm & Proceed <ArrowForwardIcon sx={{ ml: 1 }} />
              </GradientButton>
            </Box>
          </Box>
        );

      case 3: // Send Crypto
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Send {sellDetails.asset} to our Wallet
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              Please send exactly {sellDetails.amount} {sellDetails.asset} to
              the address below.
            </Alert>

            <StyledCard sx={{ mb: 3 }}>
              <CardContent>
                <Box textAlign="center" sx={{ mb: 2 }}>
                  <QrCode2Icon sx={{ fontSize: 120, color: "#6B4DFF" }} />
                </Box>

                <TextField
                  fullWidth
                  variant="outlined"
                  value="bc1q8z4f7xp46r93ufv3xrgn2qrc24avaenm3yq9h0"
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button size="small">Copy</Button>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                <Alert severity="warning">
                  Only send {sellDetails.asset} through the{" "}
                  {sellDetails.network} network. Sending any other asset or
                  using another network may result in permanent loss of funds.
                </Alert>
              </CardContent>
            </StyledCard>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <OutlinedButton onClick={handleBack}>
                <ArrowBackIcon sx={{ mr: 1 }} /> Back
              </OutlinedButton>
              <GradientButton onClick={handleNext}>
                I've Sent the Crypto <ArrowForwardIcon sx={{ ml: 1 }} />
              </GradientButton>
            </Box>
          </Box>
        );

      case 4: // Upload Proof
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upload Transaction Proof
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              Please upload a screenshot of your transaction for verification
              purposes.
            </Alert>

            <Box
              sx={{
                border: "2px dashed #6B4DFF",
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                mb: 3,
                backgroundColor: "rgba(107, 77, 255, 0.05)",
              }}
            >
              {previewImage ? (
                <Box>
                  <img
                    src={previewImage}
                    alt="Transaction Proof"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      borderRadius: "8px",
                    }}
                  />
                  <Button
                    onClick={() => setPreviewImage(null)}
                    sx={{ mt: 2 }}
                    color="error"
                    variant="outlined"
                  >
                    Remove
                  </Button>
                </Box>
              ) : (
                <Box>
                  <CloudUploadIcon
                    sx={{ fontSize: 60, color: "#6B4DFF", mb: 2 }}
                  />
                  <Typography variant="body1" gutterBottom>
                    Drag and drop your screenshot here or click to browse
                  </Typography>
                  <Button component="label" variant="contained" sx={{ mt: 2 }}>
                    Upload File
                    <VisuallyHiddenInput
                      type="file"
                      onChange={handleFileUpload}
                      accept="image/*"
                    />
                  </Button>
                </Box>
              )}
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <OutlinedButton onClick={handleBack}>
                <ArrowBackIcon sx={{ mr: 1 }} /> Back
              </OutlinedButton>
              <GradientButton
                onClick={completeTransaction}
                disabled={!previewImage || processingTransaction}
                startIcon={
                  processingTransaction ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {processingTransaction ? "Processing..." : "Submit Transaction"}
              </GradientButton>
            </Box>

            {transactionCompleted && (
              <Box
                sx={{
                  mt: 3,
                  p: 3,
                  bgcolor: "#f0f9eb",
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <CheckCircleIcon
                  sx={{ fontSize: 60, color: "#52c41a", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Transaction Submitted!
                </Typography>
                <Typography variant="body1">
                  Your sale request is being processed and funds will be
                  credited to your account shortly. Thanks for trusting us!
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => {
                    setActiveTab(0);
                    setActiveStep(0);
                    setTransactionCompleted(false);
                    setSellDetails({
                      asset: "",
                      network: "",
                      amount: "",
                      totalNaira: 0,
                      comments: "",
                      agreedToTerms: false,
                      confirmedDetails: false,
                    });
                  }}
                >
                  Start New Transaction
                </Button>
              </Box>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  // Render Buy Crypto Form
  const renderBuyCryptoSteps = () => {
    // Similar implementation to sell steps with buy-specific logic
    switch (activeStep) {
      case 0: // Select Asset
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Select Crypto Asset to Buy
            </Typography>
            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
              <InputLabel>Asset</InputLabel>
              <Select
                value={buyDetails.asset}
                onChange={handleBuyChange("asset") as any}
                label="Asset"
              >
                {cryptoAssets.map((asset) => (
                  <MenuItem key={asset.value} value={asset.value}>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: asset.color,
                          width: 24,
                          height: 24,
                          mr: 1,
                          fontSize: "0.8rem",
                        }}
                      >
                        {asset.icon}
                      </Avatar>
                      {asset.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {buyDetails.asset && (
              <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
                <InputLabel>Network</InputLabel>
                <Select
                  value={buyDetails.network}
                  onChange={handleBuyChange("network") as any}
                  label="Network"
                >
                  {networks[buyDetails.asset]?.map((network) => (
                    <MenuItem key={network.value} value={network.value}>
                      {network.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <GradientButton
                onClick={handleNext}
                disabled={!buyDetails.asset || !buyDetails.network}
              >
                Next <ArrowForwardIcon sx={{ ml: 1 }} />
              </GradientButton>
            </Box>
          </Box>
        );

      case 1: // Payment Method
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Select Payment Method
            </Typography>

            <Grid container spacing={2}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2, // equivalent to spacing={2}
                  "& > *": {
                    // Target direct children
                    width: { xs: "100%", md: "calc(50% - 8px)" }, // Account for gap
                  },
                }}
              >
                {paymentMethods.map((method) => (
                  <Box key={method.id}>
                    <Paper
                      elevation={buyDetails.paymentMethod === method.id ? 6 : 1}
                      sx={{
                        p: 2,
                        border:
                          buyDetails.paymentMethod === method.id
                            ? "2px solid #6B4DFF"
                            : "1px solid #eee",
                        borderRadius: 2,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
                        },
                        height: "100%", // Ensure equal height
                      }}
                      onClick={() => {
                        setBuyDetails({
                          ...buyDetails,
                          paymentMethod: method.id,
                        });
                      }}
                    >
                      <Box display="flex" alignItems="center">
                        <Typography variant="h5" sx={{ mr: 1 }}>
                          {method.icon}
                        </Typography>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {method.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {method.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                ))}
              </Box>
            </Grid>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <OutlinedButton onClick={handleBack}>
                <ArrowBackIcon sx={{ mr: 1 }} /> Back
              </OutlinedButton>
              <GradientButton
                onClick={handleNext}
                disabled={!buyDetails.paymentMethod}
              >
                Next <ArrowForwardIcon sx={{ ml: 1 }} />
              </GradientButton>
            </Box>
          </Box>
        );

      case 2: // Enter Amount
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Enter Amount to Buy
            </Typography>

            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
              <TextField
                label="Amount in Naira"
                variant="outlined"
                type="number"
                value={buyDetails.totalNaira}
                onChange={handleBuyChange("totalNaira")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₦</InputAdornment>
                  ),
                }}
              />
            </FormControl>

            {buyDetails.totalNaira > 0 && (
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  bgcolor: "rgba(107, 77, 255, 0.05)",
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  You will receive:
                </Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {buyDetails.amount} {buyDetails.asset}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Rate: ₦
                  {cryptoAssets
                    .find((a) => a.value === buyDetails.asset)
                    ?.rate.toLocaleString("en-NG")}{" "}
                  per {buyDetails.asset}
                </Typography>
              </Box>
            )}

            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
              <TextField
                label="Additional Comments (Optional)"
                variant="outlined"
                multiline
                rows={3}
                value={buyDetails.comments}
                onChange={handleBuyChange("comments")}
              />
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  checked={buyDetails.agreedToTerms}
                  onChange={handleBuyChange("agreedToTerms") as any}
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the Terms and Conditions
                </Typography>
              }
              sx={{ mb: 1 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={buyDetails.confirmedDetails}
                  onChange={handleBuyChange("confirmedDetails") as any}
                />
              }
              label={
                <Typography variant="body2">
                  I confirm that all details provided are correct
                </Typography>
              }
            />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <OutlinedButton onClick={handleBack}>
                <ArrowBackIcon sx={{ mr: 1 }} /> Back
              </OutlinedButton>
              <GradientButton
                onClick={handleNext}
                disabled={
                  !buyDetails.totalNaira ||
                  !buyDetails.agreedToTerms ||
                  !buyDetails.confirmedDetails
                }
              >
                Review <ArrowForwardIcon sx={{ ml: 1 }} />
              </GradientButton>
            </Box>
          </Box>
        );

      case 3: // Review
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Purchase
            </Typography>

            <StyledCard>
              <CardContent>
                <Stack spacing={2}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Asset
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {
                        cryptoAssets.find((a) => a.value === buyDetails.asset)
                          ?.label
                      }
                    </Typography>
                  </Box>

                  <Divider />

                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Network
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {
                        networks[buyDetails.asset]?.find(
                          (n) => n.value === buyDetails.network,
                        )?.label
                      }
                    </Typography>
                  </Box>

                  <Divider />

                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Payment Method
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {
                        paymentMethods.find(
                          (m) => m.id === buyDetails.paymentMethod,
                        )?.label
                      }
                    </Typography>
                  </Box>

                  <Divider />

                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Amount to Pay
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      ₦
                      {parseFloat(
                        buyDetails.totalNaira.toString(),
                      ).toLocaleString("en-NG")}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      You will receive
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="primary"
                    >
                      {buyDetails.amount} {buyDetails.asset}
                    </Typography>
                  </Box>

                  {buyDetails.comments && (
                    <>
                      <Divider />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Comments
                        </Typography>
                        <Typography variant="body2">
                          {buyDetails.comments}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Stack>
              </CardContent>
            </StyledCard>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <OutlinedButton onClick={handleBack}>
                <ArrowBackIcon sx={{ mr: 1 }} /> Back
              </OutlinedButton>
              <GradientButton onClick={handleNext}>
                Confirm & Proceed <ArrowForwardIcon sx={{ ml: 1 }} />
              </GradientButton>
            </Box>
          </Box>
        );

      case 4: // Complete Payment
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Complete Your Payment
            </Typography>

            {buyDetails.paymentMethod === "bank" ? (
              <>
                <Alert severity="info" sx={{ mb: 3 }}>
                  Please transfer ₦
                  {parseFloat(buyDetails.totalNaira.toString()).toLocaleString(
                    "en-NG",
                  )}{" "}
                  to the account details below.
                </Alert>

                <StyledCard sx={{ mb: 3 }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Bank Name
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {
                            paymentMethods.find((m) => m.id === "bank")
                              ?.accountDetails?.bankName
                          }
                        </Typography>
                      </Box>

                      <Divider />

                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Account Number
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {
                            paymentMethods.find((m) => m.id === "bank")
                              ?.accountDetails?.accountNumber
                          }
                        </Typography>
                      </Box>

                      <Divider />

                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Account Name
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {
                            paymentMethods.find((m) => m.id === "bank")
                              ?.accountDetails?.accountName
                          }
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </StyledCard>

                <Box
                  sx={{
                    border: "2px dashed #6B4DFF",
                    borderRadius: 2,
                    p: 3,
                    textAlign: "center",
                    mb: 3,
                    backgroundColor: "rgba(107, 77, 255, 0.05)",
                  }}
                >
                  {previewImage ? (
                    <Box>
                      <img
                        src={previewImage}
                        alt="Payment Proof"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "200px",
                          borderRadius: "8px",
                        }}
                      />
                      <Button
                        onClick={() => setPreviewImage(null)}
                        sx={{ mt: 2 }}
                        color="error"
                        variant="outlined"
                      >
                        Remove
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUploadIcon
                        sx={{ fontSize: 60, color: "#6B4DFF", mb: 2 }}
                      />
                      <Typography variant="body1" gutterBottom>
                        Upload proof of payment
                      </Typography>
                      <Button
                        component="label"
                        variant="contained"
                        sx={{ mt: 2 }}
                      >
                        Upload Receipt
                        <VisuallyHiddenInput
                          type="file"
                          onChange={handleFileUpload}
                          accept="image/*"
                        />
                      </Button>
                    </Box>
                  )}
                </Box>
              </>
            ) : (
              <StyledCard sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Card Payment
                  </Typography>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <TextField
                      label="Card Number"
                      variant="outlined"
                      placeholder="1234 5678 9012 3456"
                    />
                  </FormControl>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <TextField
                        label="Expiry Date"
                        variant="outlined"
                        placeholder="MM/YY"
                        fullWidth
                      />
                      <TextField
                        label="CVV"
                        variant="outlined"
                        placeholder="123"
                        fullWidth
                      />
                    </Box>
                  </Grid>

                  <TextField
                    label="Cardholder Name"
                    variant="outlined"
                    fullWidth
                  />
                </CardContent>
              </StyledCard>
            )}

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <OutlinedButton onClick={handleBack}>
                <ArrowBackIcon sx={{ mr: 1 }} /> Back
              </OutlinedButton>
              <GradientButton
                onClick={completeTransaction}
                disabled={
                  (buyDetails.paymentMethod === "bank" && !previewImage) ||
                  processingTransaction
                }
                startIcon={
                  processingTransaction ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {processingTransaction ? "Processing..." : "Complete Purchase"}
              </GradientButton>
            </Box>

            {transactionCompleted && (
              <Box
                sx={{
                  mt: 3,
                  p: 3,
                  bgcolor: "#f0f9eb",
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <CheckCircleIcon
                  sx={{ fontSize: 60, color: "#52c41a", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Purchase Successful!
                </Typography>
                <Typography variant="body1">
                  Your purchase is being processed and crypto will be sent to
                  your wallet shortly. Thanks for trading with us!
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => {
                    setActiveTab(1);
                    setActiveStep(0);
                    setTransactionCompleted(false);
                    setBuyDetails({
                      asset: "",
                      network: "",
                      amount: "",
                      totalNaira: 0,
                      paymentMethod: "",
                      comments: "",
                      agreedToTerms: false,
                      confirmedDetails: false,
                    });
                  }}
                >
                  Start New Transaction
                </Button>
              </Box>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  // Add loading and error state for market trends
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <Navigation
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      <MainContainer>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Crypto Exchange
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Buy and sell cryptocurrency at the best rates in Nigeria
          </Typography>
        </Box>

        <Paper sx={{ borderRadius: 3, overflow: "hidden", mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              aria-label="crypto exchange tabs"
              sx={{
                "& .MuiTab-root": {
                  py: 2,
                  px: 4,
                  fontWeight: 600,
                },
              }}
            >
              <Tab
                icon={<SellIcon />}
                label="Sell Crypto"
                iconPosition="start"
              />
              <Tab
                icon={<ShoppingCartIcon />}
                label="Buy Crypto"
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <TabPanel value={activeTab} index={0}>
            <Box sx={{ p: 2 }}>
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                sx={{
                  mb: 4,
                  pt: 2,
                  display: { xs: "none", sm: "flex" },
                }}
              >
                {sellSteps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {renderSellCryptoSteps()}
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Box sx={{ p: 2 }}>
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                sx={{
                  mb: 4,
                  pt: 2,
                  display: { xs: "none", sm: "flex" },
                }}
              >
                {buySteps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {renderBuyCryptoSteps()}
            </Box>
          </TabPanel>
        </Paper>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Market Trends
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 3,
                mb: 4,
              }}
            >
              {cryptoAssets.map((asset) => (
                <Box key={String(asset.value)}>
                  <StyledCard>
                    <CardContent>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ mb: 2 }}
                      >
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ bgcolor: asset.color, mr: 1 }}>
                            {asset.icon}
                          </Avatar>
                          <Typography variant="h6">{asset.value}</Typography>
                        </Box>
                        <Chip
                          icon={<TrendingUpIcon />}
                          label="+3.5%"
                          color="success"
                          size="small"
                        />
                      </Box>
                      <Typography variant="h5" fontWeight="bold">
                        ₦{asset.rate.toLocaleString("en-NG")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rate updated: {new Date().toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </StyledCard>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </MainContainer>

      <FloatingChatButton onClick={handleChatToggle}>
        <ChatIcon />
      </FloatingChatButton>

      <StyledBottomNav
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
      >
        <BottomNavigationAction label="Sell" icon={<SellIcon />} />
        <BottomNavigationAction label="Buy" icon={<ShoppingCartIcon />} />
      </StyledBottomNav>

      {renderChatDialog()}
    </>
  );
};

export default CryptoPage;
