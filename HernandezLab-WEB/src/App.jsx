import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { TEXTS } from './constants/texts';
import styles from './App.module.css';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={styles.scaffold}>
        <h1>{TEXTS.scaffold.title}</h1>
        <p>{TEXTS.scaffold.placeholder}</p>
      </div>
    </ThemeProvider>
  );
}

export default App;
