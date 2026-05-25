import { useState } from 'react';
import {
  Card, CardContent, Box, Typography, TextField, Button, Alert, Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon       from '@mui/icons-material/Error';
import { verifyAddress, verifyMnemonic, restoreWallet } from '../wallet-api';

export default function VerifyAddressPanel() {
  const [address,       setAddress]       = useState('');
  const [addressResult, setAddressResult] = useState(null);
  const [phrase,        setPhrase]        = useState('');
  const [restoreResult, setRestoreResult] = useState(null);
  const [restoreError,  setRestoreError]  = useState('');

  const checkAddress = async () => {
    if (!address.trim()) { setAddressResult(null); return; }
    setAddressResult(await verifyAddress(address.trim()));
  };

  const restore = async () => {
    setRestoreError('');
    setRestoreResult(null);
    const trimmed = phrase.trim().toLowerCase();
    const ok = await verifyMnemonic(trimmed);
    if (!ok) {
      setRestoreError('Invalid seed phrase. Check spelling and word count (12 or 24).');
      return;
    }
    try {
      setRestoreResult(await restoreWallet(trimmed));
    } catch (e) {
      setRestoreError(String(e));
    }
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>Verify a Bitcoin address</Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Check that an address is well-formed. Supports legacy <code>1...</code>, P2SH{' '}
            <code>3...</code>, SegWit <code>bc1q...</code>, and Taproot <code>bc1p...</code>.
          </Typography>

          <Box display="flex" gap={1.5} flexWrap="wrap">
            <TextField
              fullWidth
              label="Bitcoin address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              inputProps={{ style: { fontFamily: 'monospace' } }}
              sx={{ flex: 1, minWidth: 280 }}
            />
            <Button variant="contained" onClick={checkAddress} sx={{ height: 56 }}>
              Verify
            </Button>
          </Box>

          {addressResult === true && (
            <Alert icon={<CheckCircleIcon />} severity="success" sx={{ mt: 2 }}>
              Valid Bitcoin address ✓
            </Alert>
          )}
          {addressResult === false && (
            <Alert icon={<ErrorIcon />} severity="error" sx={{ mt: 2 }}>
              Invalid — bad checksum or unrecognized format.
            </Alert>
          )}
        </CardContent>
      </Card>

      <Divider sx={{ my: 3 }}>OR</Divider>

      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>Restore wallet from seed phrase</Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Enter your 12 or 24-word seed phrase to recover the Bitcoin address.
            Use this to verify your written backup actually works.
          </Typography>

          <TextField
            fullWidth multiline rows={3}
            label="Seed phrase (words separated by spaces)"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            inputProps={{ style: { fontFamily: 'monospace' } }}
            sx={{ mb: 2 }}
          />

          <Button variant="contained" onClick={restore}>
            Restore wallet
          </Button>

          {restoreError && <Alert severity="error" sx={{ mt: 2 }}>{restoreError}</Alert>}

          {restoreResult && (
            <Alert icon={<CheckCircleIcon />} severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                <b>Address:</b>{' '}
                <Box component="span" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {restoreResult.address}
                </Box>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Path: {restoreResult.derivationPath}
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
