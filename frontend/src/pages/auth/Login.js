import React, { useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login, clearAuthError } from '../../features/auth/authSlice';
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
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
} from '@mui/icons-material';
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Form validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      showPassword: false,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        await dispatch(login({
          email: values.email,
          password: values.password
        })).unwrap();
        
        // Reset form after successful submission
        formik.resetForm();
      } catch (error) {
        // Error is already handled in the authSlice
        setSubmitting(false);
      }
    },
  });

  const { 
    values, 
    errors, 
    touched, 
    isSubmitting, 
    handleChange, 
    handleBlur, 
    handleSubmit,
    setFieldValue,
    setFieldTouched
  } = formik;
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const redirect = location.search ? `/${location.search.split('=')[1]}` : '/';
  
  // Clear any existing errors when component mounts
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    // Only redirect if authenticated
    if (isAuthenticated) {
      navigate(redirect || '/');
    }
  }, [isAuthenticated, navigate, redirect]);

  useEffect(() => {
    // Show error if there is an error
    if (error) {
      dispatch(setAlert({ message: error, alertType: 'error' }));
      // Clear the error after showing the alert
      const timer = setTimeout(() => {
        dispatch(clearAuthError());
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);
  
  // Reset submitting state is handled by Formik

  const handleClickShowPassword = () => {
    setFieldValue('showPassword', !formik.values.showPassword);
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    dispatch(setAlert({ message: 'Google login coming soon!', alertType: 'info' }));
  };

  const handleFacebookLogin = () => {
    // TODO: Implement Facebook OAuth
    dispatch(setAlert({ message: 'Facebook login coming soon!', alertType: 'info' }));
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
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary" mt={1}>
              Sign in to access your account
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                )
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={values.showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
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
                      onClick={handleClickShowPassword}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 1 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                color="primary"
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={isSubmitting || loading}
              startIcon={isSubmitting || loading ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                mt: 1,
                mb: 2,
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR CONTINUE WITH
            </Typography>
          </Divider>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                color: 'text.primary',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'text.primary',
                  backgroundColor: 'action.hover',
                },
              }}
            >
              Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FacebookIcon color="primary" />}
              onClick={handleFacebookLogin}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                color: 'text.primary',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'text.primary',
                  backgroundColor: 'action.hover',
                },
              }}
            >
              Facebook
            </Button>
          </Box>

          <Box textAlign="center" mt={3}>
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

export default Login;
