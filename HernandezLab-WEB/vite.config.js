import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@emotion/react',
      '@emotion/styled',
      '@mui/material',
      '@mui/material/styles',
      '@mui/system',
      '@mui/system/colorManipulator',
      '@mui/system/styled',
      '@mui/system/createStyled',
      '@mui/system/createTheme',
      '@mui/system/styleFunctionSx',
      '@mui/system/useThemeWithoutDefault',
      '@mui/system/useThemeProps',
      '@mui/system/useMediaQuery',
      '@mui/system/DefaultPropsProvider',
      '@mui/system/InitColorSchemeScript',
      '@mui/system/RtlProvider',
      '@mui/icons-material',
      'hoist-non-react-statics',
      'prop-types',
      'react-is',
      'clsx',
      'style-to-js',
      'style-to-object',
      'debug',
      'extend',
    ],
    exclude: ['lucide-react'],
  },
  server: {
    port: 3006,
    strictPort: true,
  },
});
