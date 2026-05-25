import { Alert, AlertTitle, Box, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function WarningCard() {
  return (
    <Alert
      icon={<WarningAmberIcon fontSize="large" />}
      severity="warning"
      sx={{ mb: 3, border: '1px solid', borderColor: 'warning.main' }}
    >
      <AlertTitle sx={{ fontWeight: 700 }}>Read this before continuing</AlertTitle>
      <Box component="ul" sx={{ pl: 2, m: 0 }}>
        <Typography component="li" variant="body2">
          This is a <b>real</b> Bitcoin wallet — addresses work on the live network.
        </Typography>
        <Typography component="li" variant="body2">
          All cryptography runs locally in Rust. Nothing is sent over the network.
        </Typography>
        <Typography component="li" variant="body2">
          Whoever has the seed phrase owns the Bitcoin. <b>Never share it.</b>
        </Typography>
        <Typography component="li" variant="body2">
          Write it on paper. Don't screenshot, email, or store in cloud storage.
        </Typography>
      </Box>
    </Alert>
  );
}
