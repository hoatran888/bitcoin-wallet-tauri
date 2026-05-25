import { useState } from 'react';
import {
  Card, CardContent, Box, Typography, Button, TextField, Alert, Grid,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon     from '@mui/icons-material/Refresh';

function pickRandomIndices(total, count) {
  const idxs = new Set();
  while (idxs.size < count) idxs.add(Math.floor(Math.random() * total));
  return [...idxs].sort((a, b) => a - b);
}

export default function SeedVerifyPanel({ mnemonic, onVerified, onBack }) {
  const words = mnemonic.split(' ');
  const [challenge, setChallenge] = useState(() => pickRandomIndices(words.length, 3));
  const [inputs,    setInputs]    = useState({});
  const [error,     setError]     = useState('');

  const handleChange = (idx, val) =>
    setInputs(prev => ({ ...prev, [idx]: val.trim().toLowerCase() }));

  const verify = () => {
    const wrong = challenge.filter(i => inputs[i] !== words[i]);
    if (wrong.length === 0) {
      onVerified();
    } else {
      setError(`Word #${wrong.map(i => i + 1).join(', #')} doesn't match. Check your written copy.`);
    }
  };

  const reshuffle = () => {
    setChallenge(pickRandomIndices(words.length, 3));
    setInputs({});
    setError('');
  };

  const allFilled = challenge.every(i => inputs[i]?.length > 0);

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        Prove you wrote down the seed phrase correctly. Enter the words at the positions below.
      </Alert>

      <Card>
        <CardContent>
          <Typography variant="h6" mb={3}>Verify your seed phrase</Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {challenge.map((idx) => (
              <Grid item xs={12} sm={4} key={idx}>
                <TextField
                  fullWidth
                  label={`Word #${idx + 1}`}
                  value={inputs[idx] || ''}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  autoComplete="off"
                  inputProps={{ style: { fontFamily: 'monospace' } }}
                />
              </Grid>
            ))}
          </Grid>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box display="flex" gap={1.5}>
            <Button
              variant="contained" color="primary"
              startIcon={<CheckCircleIcon />}
              disabled={!allFilled}
              onClick={verify}
            >
              Verify
            </Button>
            <Button startIcon={<RefreshIcon />} onClick={reshuffle}>
              Different words
            </Button>
            <Button onClick={onBack}>← Back to seed</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
