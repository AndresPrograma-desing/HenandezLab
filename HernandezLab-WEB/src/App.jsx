import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { TEXTS } from './constants/texts';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>{TEXTS.scaffold.title}</h1>
        <p>{TEXTS.scaffold.placeholder}</p>
      </div>
    </ThemeProvider>
  );
}

export default App;
