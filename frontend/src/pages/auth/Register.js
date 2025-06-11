import React, { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearAuthError } from '../../features/auth/authSlice';
import { setAlert } from '../../features/alert/alertSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
  FormControlLabel,
  Checkbox,
  Grid,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  School as SchoolIcon,
} from '@mui/icons-material';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Form validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
    termsAccepted: Yup.boolean()
      .oneOf([true], 'You must accept the terms and conditions')
      .required('You must accept the terms and conditions')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      termsAccepted: false,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        await dispatch(register({
          name: values.name,
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

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }

    if (error) {
      dispatch(setAlert({ message: error, alertType: 'error' }));
      dispatch(clearAuthError());
    }
  }, [isAuthenticated, error, navigate, dispatch]);

  const handleClickShowPassword = (field) => {
    setFieldValue(field, !formik.values[field]);
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
              Create an Account
            </Typography>
            <Typography variant="body1" color="text.secondary" mt={1}>
              Join our community of UGC NET aspirants
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
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
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
                ),
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
              autoComplete="new-password"
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
                      onClick={() => handleClickShowPassword('showPassword')}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={values.showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmPassword && Boolean(errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
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
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {values.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="termsAccepted"
                  color="primary"
                  checked={values.termsAccepted}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the{' '}
                  <Link component={RouterLink} to="/terms" color="primary">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link component={RouterLink} to="/privacy" color="primary">
                    Privacy Policy
                  </Link>
                </Typography>
              }
              sx={{ mb: 3, alignItems: 'flex-start' }}
            />
            {touched.termsAccepted && errors.termsAccepted && (
              <Typography color="error" variant="caption" display="block" gutterBottom>
                {errors.termsAccepted}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={isSubmitting || loading}
              startIcon={isSubmitting || loading ? <CircularProgress size={20} color="inherit" /> : <SchoolIcon />}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                mb: 2,
              }}
            >
              {isSubmitting || loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              ALREADY HAVE AN ACCOUNT?
            </Typography>
          </Divider>

          <Box textAlign="center" mt={3}>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              color="primary"
              size="large"
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              Sign In
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
