// components/TwoFactorAuthModal.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box
} from '@mui/material';

interface TwoFactorAuthModalProps {
  open: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
}

const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({ open, onClose, onVerify }) => {
  const [code, setCode] = useState('');

  const handleVerify = () => {
    onVerify(code);
    setCode('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          A 6-digit verification code has been sent to your email or phone. Enter it below to enable 2FA.
        </Typography>
        <TextField
          label="Verification Code"
          fullWidth
          value={code}
          onChange={(e) => setCode(e.target.value)}
          inputProps={{ maxLength: 6 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleVerify}>Verify</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TwoFactorAuthModal;
