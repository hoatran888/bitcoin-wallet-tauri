import { createTheme } from '@mui/material/styles';

export default createTheme({
  palette: {
    mode: 'dark',
    primary:    { main: '#f0a830' },
    secondary:  { main: '#3b82f6' },
    success:    { main: '#34d399' },
    warning:    { main: '#f0a830' },
    error:      { main: '#f85149' },
    background: { default: '#0d1117', paper: '#161b22' },
    text:       { primary: '#e6edf3', secondary: '#8b949e' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard:   { styleOverrides: { root: { border: '1px solid #30363d', backgroundImage: 'none' } } },
    MuiButton: { defaultProps: { disableElevation: true } },
  },
});
