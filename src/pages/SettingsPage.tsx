import React, { useState, ChangeEvent } from "react";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Button,
  TextField,
  Divider,
  Switch,
  FormControlLabel,
  Paper,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  MenuItem,
} from "@mui/material";
import {
  CameraAlt,
  Visibility,
  VisibilityOff,
  Brightness4,
  Brightness7,
  AccountCircle,
  AccountBalance,
  Security,
  Notifications,
  Language,
  Help,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Navigation from "../components/Navigation";
import ChangePasswordModal from "../components/ChangePasswordModal";
import TwoFactorAuthModal from "../components/TwoFactorAuthModal";
import axios from "axios";

// Type Definitions
interface SettingsPageProps {
  toggleTheme: () => void;
  themeMode: "light" | "dark";
}

interface ProfileState {
  name: string;
  email: string;
  phone: string;
}

interface BankDetailsState {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

interface NotificationsState {
  email: boolean;
  sms: boolean;
  push: boolean;
}

// Styled Components
const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[4],
  },
}));

const SectionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[1],
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[3],
  },
}));

const SettingsPage = ({ toggleTheme, themeMode }: SettingsPageProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [open2FAModal, setOpen2FAModal] = useState(false);

  const [profile, setProfile] = useState<ProfileState>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+234 812 345 6789",
  });
  const [bankDetails, setBankDetails] = useState<BankDetailsState>({
    bankName: "First Bank",
    accountNumber: "1234567890",
    accountName: "John Doe",
  });
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [notifications, setNotifications] = useState<NotificationsState>({
    email: true,
    sms: false,
    push: true,
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({ ...prev, [name]: checked }));
  };
  const handlePasswordSave = (current: string, newPass: string) => {
    // Call API or add validation here
    console.log("Changing password from", current, "to", newPass);
  };
  const handle2FAVerification = (code: string) => {
    // API logic to verify 2FA code
    console.log("Verifying 2FA code:", code);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    // API call to save profile
    console.log("Profile saved:", profile);
  };

  const saveBankDetails = async () => {
    try {
      setLoading(true);
      // API call to save bank details would go here
      // For example: await updateBankDetails(bankDetails);
      console.log("Bank details saved:", bankDetails);
      setLoading(false);
    } catch (err) {
      console.error("Error saving bank details:", err);
      setError("Failed to save bank details. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navigation
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - 240px)` },
          ml: { md: "240px" },
        }}
      >
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Container maxWidth="md">
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 4 }}
          >
            Account Settings
          </Typography>

          {/* Profile Section */}
          <SectionCard>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <AccountCircle color="primary" sx={{ mr: 1, fontSize: 30 }} />
              <Typography variant="h6">Profile Information</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  mr: isMobile ? 0 : 3,
                  mb: isMobile ? 2 : 0,
                }}
              >
                <StyledAvatar
                  src={previewImage || "/default-avatar.png"}
                  alt="Profile"
                />
                <IconButton
                  color="primary"
                  component="label"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    bgcolor: "background.paper",
                  }}
                >
                  <CameraAlt />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload}
                  />
                </IconButton>
              </Box>

              <Box sx={{ flexGrow: 1, width: "100%" }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button variant="contained" onClick={saveProfile}>
                Save Profile
              </Button>
            </Box>
          </SectionCard>

          {/* Bank Details Section */}
          <SectionCard>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <AccountBalance color="primary" sx={{ mr: 1, fontSize: 30 }} />
              <Typography variant="h6">Bank Account Details</Typography>
            </Box>

            <TextField
              fullWidth
              label="Bank Name"
              name="bankName"
              value={bankDetails.bankName}
              onChange={handleBankChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Account Number"
              name="accountNumber"
              type={showAccountNumber ? "text" : "password"}
              value={bankDetails.accountNumber}
              onChange={handleBankChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowAccountNumber(!showAccountNumber)}
                      edge="end"
                    >
                      {showAccountNumber ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Account Name"
              name="accountName"
              value={bankDetails.accountName}
              onChange={handleBankChange}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button variant="contained" onClick={saveBankDetails}>
                Save Bank Details
              </Button>
            </Box>
          </SectionCard>

          {/* Preferences Section */}
          <SectionCard>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Brightness4 color="primary" sx={{ mr: 1, fontSize: 30 }} />
              <Typography variant="h6">Preferences</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {themeMode === "dark" ? (
                  <Brightness7 sx={{ mr: 1 }} />
                ) : (
                  <Brightness4 sx={{ mr: 1 }} />
                )}
                <Typography>Dark Mode</Typography>
              </Box>
              <Switch
                checked={themeMode === "dark"}
                onChange={toggleTheme}
                color="primary"
              />
            </Box>
          </SectionCard>

          {/* Notifications Section */}
          <SectionCard>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Notifications color="primary" sx={{ mr: 1, fontSize: 30 }} />
              <Typography variant="h6">Notifications</Typography>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={notifications.email}
                  onChange={handleNotificationChange}
                  name="email"
                  color="primary"
                />
              }
              label="Email Notifications"
              sx={{ mb: 1 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={notifications.sms}
                  onChange={handleNotificationChange}
                  name="sms"
                  color="primary"
                />
              }
              label="SMS Notifications"
              sx={{ mb: 1 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={notifications.push}
                  onChange={handleNotificationChange}
                  name="push"
                  color="primary"
                />
              }
              label="Push Notifications"
            />
          </SectionCard>

          {/* Security Section */}
          {/* Security Section */}
          <SectionCard>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Security color="primary" sx={{ mr: 1, fontSize: 30 }} />
              <Typography variant="h6">Security</Typography>
            </Box>

            <Button
              variant="outlined"
              sx={{ mr: 2 }}
              onClick={() => setOpenChangePassword(true)}
            >
              Change Password
            </Button>

            <Button variant="outlined" onClick={() => setOpen2FAModal(true)}>
              Two-Factor Authentication
            </Button>

            {/* Modals */}
            <ChangePasswordModal
              open={openChangePassword}
              onClose={() => setOpenChangePassword(false)}
              onSave={handlePasswordSave}
            />

            <TwoFactorAuthModal
              open={open2FAModal}
              onClose={() => setOpen2FAModal(false)}
              onVerify={handle2FAVerification}
            />
          </SectionCard>

          {/* Language Section */}
          <SectionCard>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Language color="primary" sx={{ mr: 1, fontSize: 30 }} />
              <Typography variant="h6">Language & Region</Typography>
            </Box>

            <TextField
              select
              label="Language"
              defaultValue="en"
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="fr">French</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
            </TextField>
          </SectionCard>

          {/* Support Section */}
          <SectionCard>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Help color="primary" sx={{ mr: 1, fontSize: 30 }} />
              <Typography variant="h6">Support</Typography>
            </Box>

            <Button variant="outlined" sx={{ mr: 2 }}>
              Help Center
            </Button>

            <Button variant="outlined" sx={{ mr: 2 }}>
              Contact Support
            </Button>

            <Button variant="outlined" color="error">
              Delete Account
            </Button>
          </SectionCard>
        </Container>
      </Box>
    </Box>
  );
};

export default SettingsPage;
