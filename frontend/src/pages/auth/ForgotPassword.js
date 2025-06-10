import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError } from '../../features/auth/authSlice';
import { setAlert } from '../../features/alert/alertSlice';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Link,
  Divider,
  InputAdornment,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Email as EmailIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const { loading, error, message } = useSelector((state) => ({
    loading: state.auth.loading,
    error: state.auth.error,
    message: state.auth.message,
  }));

  useEffect(() => {
    if (error) {
      dispatch(setAlert({ message: error, alertType: 'error' }));
      dispatch(clearAuthError());
    }
    
    if (message) {
      dispatch(setAlert({ message, alertType: 'success' }));
      
    }
  }, [error, message, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      dispatch(setAlert({ message: 'Please enter your email', alertType: 'error' }));
      return;
    }
    
    // Show success message and reset form
    dispatch(setAlert({ 
      message: 'If an account with that email exists, you will receive a password reset link.', 
      alertType: 'success' 
    }));
    setSubmitted(true);
    setEmail('');
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: 'calc(100vh - 200px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4 },
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Box textAlign="center" mb={4}>
            <Typography component="h1" variant="h4" fontWeight="bold" color="primary">
              Forgot Password
            </Typography>
            <Typography variant="body1" color="text.secondary" mt={1}>
              {submitted 
                ? 'Check your email for a link to reset your password.'
                : 'Enter your email address and we\'ll send you a link to reset your password.'}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {!submitted ? (
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </Box>
          ) : (
            <Box textAlign="center" mt={4}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                If an account exists with {email}, you will receive an email with instructions to reset your password.
                If you don't see the email, please check your spam folder.
              </Typography>
              
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                color="primary"
                startIcon={<ArrowBackIcon />}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  mt: 2,
                }}
              >
                Back to Login
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 4 }} />

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link
                component={RouterLink}
                to="/register"
                color="primary"
                sx={{ fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
