import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  Box, 
  Container, 
  Typography, 
  Button 
} from '@mui/material';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Alert from './components/layout/Alert';
import PrivateRoute from './utils/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Profile from './pages/profile/Profile';

// Placeholder components for routes that will be implemented later
const ComingSoon = () => (
  <Box sx={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
    <Typography variant="h4" gutterBottom>Coming Soon</Typography>
    <Typography variant="body1" color="text.secondary">
      This page is under development.
    </Typography>
  </Box>
);

const NotFound = () => (
  <Box sx={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
    <Typography variant="h4" gutterBottom>404 - Page Not Found</Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
      The page you are looking for does not exist.
    </Typography>
    <Button component={RouterLink} to="/" variant="contained">
      Go to Home
    </Button>
  </Box>
);

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 500,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 24px 0 rgba(0,0,0,0.1)',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                backgroundColor: '#f5f7fa',
              }}
            >
              <Navbar />
              <Alert />
              <Box component="main" sx={{ flexGrow: 1, py: 4, px: { xs: 2, sm: 3 } }}>
                <Container maxWidth="xl">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
                    <Route
                      path="/profile/*"
                      element={
                        <PrivateRoute>
                          <Profile />
                        </PrivateRoute>
                      }
                    />
                    
                    {/* Placeholder routes for future implementation */}
                    <Route path="/subjects" element={<ComingSoon />} />
                    <Route path="/subjects/:id" element={<ComingSoon />} />
                    <Route path="/topics" element={<ComingSoon />} />
                    <Route path="/topics/:id" element={<ComingSoon />} />
                    <Route path="/questions" element={<ComingSoon />} />
                    <Route path="/questions/:id" element={<ComingSoon />} />
                    <Route path="/practice" element={
                      <PrivateRoute>
                        <ComingSoon />
                      </PrivateRoute>
                    } />
                    
                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Container>
              </Box>
              <Footer />
            </Box>
          </Router>
        </ThemeProvider>
  );
}

export default App;
