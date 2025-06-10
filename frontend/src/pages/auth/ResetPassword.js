import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
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
  IconButton,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resetToken } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
  });
  
  const { password, confirmPassword, showPassword, showConfirmPassword } = formData;
  
  const { loading, error, success } = useSelector((state) => ({
    loading: state.auth.loading,
    error: state.auth.error,
    success: state.auth.success,
  }));

  useEffect(() => {
    if (error) {
      dispatch(setAlert({ message: error, alertType: 'error' }));
      dispatch(clearAuthError());
    }
    
    if (success) {
      dispatch(setAlert({ 
        message: 'Password reset successfully. You can now log in with your new password.', 
        alertType: 'success' 
      }));
      navigate('/login');
    }
  }, [error, success, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClickShowPassword = (field) => {
    setFormData({
      ...formData,
      [field]: !formData[field],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      dispatch(setAlert({ message: 'Please enter and confirm your new password', alertType: 'error' }));
      return;
    }
    
    if (password !== confirmPassword) {
      dispatch(setAlert({ message: 'Passwords do not match', alertType: 'error' }));
      return;
    }
    
    if (password.length < 6) {
      dispatch(setAlert({ message: 'Password must be at least 6 characters', alertType: 'error' }));
      return;
    }
    
    // Show success message and redirect to login
    dispatch(setAlert({ 
      message: 'Password has been reset successfully. You can now log in with your new password.', 
      alertType: 'success' 
    }));
    navigate('/login');
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
              Reset Your Password
            </Typography>
            <Typography variant="body1" color="text.secondary" mt={1}>
              Please enter your new password below.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleClickShowPassword('showPassword')}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
              helperText="Password must be at least 6 characters long"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => handleClickShowPassword('showConfirmPassword')}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
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
                'Reset Password'
              )}
            </Button>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Remembered your password?{' '}
              <Link
                component={RouterLink}
                to="/login"
                color="primary"
                sx={{ fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPassword;
