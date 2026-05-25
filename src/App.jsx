import { useState } from 'react';
import {
  Box, Container, Typography, Tabs, Tab,
  Stepper, Step, StepLabel, Chip, Snackbar, Alert,
} from '@mui/material';
import GeneratePanel       from './components/GeneratePanel';
import SeedPhrasePanel     from './components/SeedPhrasePanel';
import SeedVerifyPanel     from './components/SeedVerifyPanel';
import WalletDisplayPanel  from './components/WalletDisplayPanel';
import VerifyAddressPanel  from './components/VerifyAddressPanel';
import { generateWallet }  from './wallet-api';

const STEPS = ['Generate', 'Save seed phrase', 'Verify', 'Wallet ready'];

export default function App() {
  const [tab,    setTab]    = useState(0);
  const [step,   setStep]   = useState(0);
  const [wallet, setWallet] = useState(null);
  const [busy,   setBusy]   = useState(false);
  const [error,  setError]  = useState('');

  const onGenerate = async (wordCount) => {
    setBusy(true);
    try {
      const w = await generateWallet(wordCount);
      setWallet(w);
      setStep(1);
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  };

  const onRestart = () => {
    setWallet(null);
    setStep(0);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 5 }}>
      <Container maxWidth="md">

        <Box textAlign="center" mb={4}>
          <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
            <Typography variant="h4" fontWeight={700}>
              ₿ Bitcoin Wallet
            </Typography>
            <Chip label="Rust + React" size="small" color="primary" variant="outlined" />
          </Box>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            BIP39 / BIP84 · crypto runs in Rust · UI in React + MUI
          </Typography>
        </Box>

        <Tabs
          value={tab} centered
          onChange={(_, v) => setTab(v)}
          sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Create Wallet" />
          <Tab label="Verify / Restore" />
        </Tabs>

        {tab === 0 && (
          <>
            <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
              {STEPS.map((label) => (
                <Step key={label}><StepLabel>{label}</StepLabel></Step>
              ))}
            </Stepper>

            {step === 0 && <GeneratePanel onGenerate={onGenerate} busy={busy} />}
            {step === 1 && wallet && (
              <SeedPhrasePanel
                mnemonic={wallet.mnemonic}
                onContinue={() => setStep(2)}
              />
            )}
            {step === 2 && wallet && (
              <SeedVerifyPanel
                mnemonic={wallet.mnemonic}
                onVerified={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && wallet && (
              <WalletDisplayPanel wallet={wallet} onRestart={onRestart} />
            )}
          </>
        )}

        {tab === 1 && <VerifyAddressPanel />}

      </Container>

      <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError('')}>
        <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
      </Snackbar>
    </Box>
  );
}
