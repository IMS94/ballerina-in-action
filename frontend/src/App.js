import './App.css';
import { createTheme, ThemeProvider } from "@material-ui/core";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from 'notistack';
import { AuthProvider } from '@asgardeo/auth-react';
import { default as authConfig } from './config.json';
import SampleApp from './views/SampleApp';

const theme = createTheme({});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider config={authConfig}>
        <SnackbarProvider maxSnack={3}>
          <BrowserRouter>
            <SampleApp />
          </BrowserRouter>
        </SnackbarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
