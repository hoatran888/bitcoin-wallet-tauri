import { useState } from 'react';
import {
  Card, CardContent, Box, Typography, Button,
  ToggleButtonGroup, ToggleButton, FormControlLabel, Checkbox, Chip,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';
import WarningCard from './WarningCard';

export default function GeneratePanel({ onGenerate, busy }) {
  const [wordCount,    setWordCount]    = useState(12);
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <Box>
      <WarningCard />

      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Typography variant="h6">Create a new Bitcoin wallet</Typography>
            <Chip label="Rust crypto" size="small" color="primary" variant="outlined" />
          </Box>

          <Typography variant="body2" color="text.secondary" mb={3}>
            Generated using BIP39 (mnemonic) and BIP84 (native SegWit) — the same
            standards used by Ledger and Trezor. All key derivation runs in the
            <b> rust-bitcoin</b> library, maintained by Bitcoin Core contributors.
          </Typography>

          <Typography variant="subtitle2" color="text.secondary" mb={1}>
            Seed phrase length
          </Typography>
          <ToggleButtonGroup
            value={wordCount}
            exclusive
            onChange={(_, v) => v && setWordCount(v)}
            sx={{ mb: 3 }}
          >
            <ToggleButton value={12}>12 words (128-bit)</ToggleButton>
            <ToggleButton value={24}>24 words (256-bit — extra secure)</ToggleButton>
          </ToggleButtonGroup>

          <FormControlLabel
            control={
              <Checkbox
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
              />
            }
            label="I understand losing the seed phrase means losing the Bitcoin forever."
            sx={{ display: 'block', mb: 3 }}
          />

          <Button
            variant="contained" color="primary" size="large"
            startIcon={<AddCircleOutlineIcon />}
            disabled={!acknowledged || busy}
            onClick={() => onGenerate(wordCount)}
          >
            {busy ? 'Generating…' : 'Generate wallet'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
