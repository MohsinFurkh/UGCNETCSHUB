import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setAlert } from '../alert/alertSlice';
import { API_BASE_URL } from '../../utils/apiConfig';

// Async thunks
export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { dispatch, rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify({ name, email, password });

      const res = await axios.post(`${API_BASE_URL}/auth/register`, body, config);

      if (res.data) {
        // Store the token in local storage
        localStorage.setItem('token', res.data.token);
        
        dispatch(
          setAlert({ message: 'Registration successful!', alertType: 'success' })
        );
        
        return res.data;
      } else {
        return rejectWithValue('Registration failed - No data received');
      }
    } catch (err) {
      // Handle different types of errors
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.response) {
        // Server responded with an error status code
        if (err.response.status === 400 && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.errors) {
          // Handle validation errors
          err.response.data.errors.forEach(error => {
            dispatch(setAlert({ message: error.msg, alertType: 'error' }));
          });
          return rejectWithValue('Validation error');
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
      }
      
      dispatch(setAlert({ message: errorMessage, alertType: 'error' }));
      return rejectWithValue(errorMessage);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify({ email, password });

      const res = await axios.post(`${API_BASE_URL}/auth/login`, body, config);

      if (res.data) {
        // Store the token in local storage
        localStorage.setItem('token', res.data.token);
        
        dispatch(
          setAlert({ message: 'Login successful!', alertType: 'success' })
        );
        
        return res.data;
      } else {
        return rejectWithValue('Login failed - No data received');
      }
    } catch (err) {
      // Handle different types of errors
      let errorMessage = 'Login failed. Please check your credentials and try again.';
      
      if (err.response) {
        // Server responded with an error status code
        if (err.response.status === 400 || err.response.status === 401) {
          errorMessage = err.response.data.message || 'Invalid email or password';
        } else if (err.response.data.errors) {
          // Handle validation errors
          err.response.data.errors.forEach(error => {
            dispatch(setAlert({ message: error.msg, alertType: 'error' }));
          });
          return rejectWithValue('Validation error');
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
      }
      
      dispatch(setAlert({ message: errorMessage, alertType: 'error' }));
      return rejectWithValue(errorMessage);
    }
  }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      if (token) {
        setAuthToken(token);
      }

      const res = await axios.get(`${API_BASE_URL}/auth/profile`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to load user');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ name, email, password }, { getState, dispatch, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      if (token) {
        setAuthToken(token);
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify({ name, email, password: password || undefined });

      const res = await axios.put(`${API_BASE_URL}/auth/profile`, body, config);

      dispatch(
        setAlert({ message: 'Profile updated!', alertType: 'success' })
      );

      return res.data;
    } catch (err) {
      const errors = err.response?.data?.errors;

      if (errors) {
        errors.forEach((error) =>
          dispatch(setAlert({ message: error.msg, alertType: 'error' }))
        );
      }
      return rejectWithValue(err.response?.data || 'Profile update failed');
    }
  }
);

// Set token in axios header
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['x-auth-token'];
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    clearLoading: (state) => {
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      const { token, ...user } = action.payload;
      localStorage.setItem('token', token);
      setAuthToken(token);
      state.token = token;
      state.isAuthenticated = true;
      state.loading = false;
      state.user = user;
    });
    builder.addCase(register.rejected, (state) => {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['x-auth-token'];
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
    });

    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      const { token, ...user } = action.payload;
      localStorage.setItem('token', token);
      setAuthToken(token);
      state.token = token;
      state.isAuthenticated = true;
      state.loading = false;
      state.user = user;
    });
    builder.addCase(login.rejected, (state) => {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['x-auth-token'];
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
    });

    // Load User
    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(loadUser.rejected, (state) => {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['x-auth-token'];
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
    });

    // Update Profile
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { logout, clearAuthError, clearLoading } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;

export default authSlice.reducer;
