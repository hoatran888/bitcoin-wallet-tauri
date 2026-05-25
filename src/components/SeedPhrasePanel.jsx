import { useState } from 'react';
import {
  Card, CardContent, Box, Typography, Button, Grid, Chip, Alert, Snackbar,
} from '@mui/material';
import ContentCopyIcon   from '@mui/icons-material/ContentCopy';
import VisibilityIcon    from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon   from '@mui/icons-material/CheckCircle';

export default function SeedPhrasePanel({ mnemonic, onContinue }) {
  const [revealed, setRevealed] = useState(false);
  const [toast,    setToast]    = useState(false);
  const words = mnemonic.split(' ');

  const copy = async () => {
    await navigator.clipboard.writeText(mnemonic);
    setToast(true);
  };

  return (
    <Box>
      <Alert severity="error" sx={{ mb: 3 }}>
        <b>Write these words down on paper, in order.</b> If you lose them, you lose all funds.
        Do not screenshot or save digitally.
      </Alert>

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Your seed phrase</Typography>
            <Box display="flex" gap={1}>
              <Button
                size="small"
                startIcon={revealed ? <VisibilityOffIcon /> : <VisibilityIcon />}
                onClick={() => setRevealed(!revealed)}
              >
                {revealed ? 'Hide' : 'Reveal'}
              </Button>
              <Button
                size="small"
                startIcon={<ContentCopyIcon />}
                onClick={copy}
                disabled={!revealed}
              >
                Copy
              </Button>
            </Box>
          </Box>

          <Grid container spacing={1.5} sx={{ mb: 3 }}>
            {words.map((word, i) => (
              <Grid item xs={6} sm={4} md={3} key={i}>
                <Box sx={{
                  bgcolor: 'background.default',
                  border: '1px solid #30363d',
                  borderRadius: 1,
                  px: 1.5, py: 1,
                  display: 'flex', alignItems: 'center', gap: 1,
                  fontFamily: 'monospace',
                }}>
                  <Chip
                    label={i + 1}
                    size="small"
                    sx={{ minWidth: 28, height: 20, fontSize: '0.7rem' }}
                  />
                  <Typography component="span" sx={{ flex: 1, fontFamily: 'monospace' }}>
                    {revealed ? word : '••••••'}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Button
            variant="contained" color="primary" size="large"
            startIcon={<CheckCircleIcon />}
            onClick={onContinue}
            disabled={!revealed}
          >
            I've written it down — continue
          </Button>
        </CardContent>
      </Card>

      <Snackbar
        open={toast}
        autoHideDuration={2000}
        onClose={() => setToast(false)}
        message="Seed copied — clear clipboard after writing it down!"
      />
    </Box>
  );
}
