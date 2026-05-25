import { useState } from 'react';
import {
  Card, CardContent, Box, Typography, Button, TextField,
  IconButton, Alert, Divider,
} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import ContentCopyIcon   from '@mui/icons-material/ContentCopy';
import VisibilityIcon    from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon   from '@mui/icons-material/CheckCircle';
import RestartAltIcon    from '@mui/icons-material/RestartAlt';

function CopyField({ label, value, mono = true, sensitive = false }) {
  const [shown, setShown] = useState(!sensitive);
  return (
    <Box mb={2}>
      <Typography variant="caption" color="text.secondary"
        sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </Typography>
      <Box display="flex" alignItems="center" gap={1}>
        <TextField
          fullWidth
          value={shown ? value : '•'.repeat(Math.min(value.length, 32))}
          InputProps={{
            readOnly: true,
            style: { fontFamily: mono ? 'monospace' : 'inherit', fontSize: '0.9rem' },
          }}
          size="small"
        />
        {sensitive && (
          <IconButton onClick={() => setShown(!shown)} size="small">
            {shown ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        )}
        <IconButton onClick={() => navigator.clipboard.writeText(value)} size="small">
          <ContentCopyIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default function WalletDisplayPanel({ wallet, onRestart }) {
  return (
    <Box>
      <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 3 }}>
        <b>Wallet ready.</b> Your seed phrase is verified — you can now safely receive Bitcoin
        at the address below.
      </Alert>

      <Card>
        <CardContent>
          <Box display="flex" gap={4} flexWrap="wrap" justifyContent="center" mb={3}>
            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2 }}>
              <QRCodeSVG value={wallet.address} size={200} level="M" />
            </Box>
            <Box flex={1} minWidth={280}>
              <Typography variant="h6" mb={1}>Receive Bitcoin</Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Scan this QR code or share the address below. Anyone with the address can
                send BTC — but only you (with the seed phrase) can spend it.
              </Typography>
              <CopyField label="Bitcoin Address (BIP84 native SegWit)" value={wallet.address} />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle2" mb={2}>Wallet details</Typography>
          <CopyField label="Derivation Path"   value={wallet.derivationPath} />
          <CopyField label="Public Key"        value={wallet.publicKeyHex} />
          <CopyField label="Private Key (WIF)" value={wallet.privateKeyWif} sensitive />

          <Alert severity="warning" sx={{ mt: 3 }}>
            <b>Private Key</b> can spend funds at this address WITHOUT the seed phrase.
            Keep it as private as the seed phrase itself.
          </Alert>

          <Box mt={3}>
            <Button
              variant="outlined"
              startIcon={<RestartAltIcon />}
              onClick={onRestart}
            >
              Generate a different wallet
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
