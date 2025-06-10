import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setAlert } from '../alert/alertSlice';

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

      const res = await axios.post('/api/auth/register', body, config);

      dispatch(
        setAlert({ message: 'Registration successful!', alertType: 'success' })
      );

      return res.data;
    } catch (err) {
      const errors = err.response?.data?.errors;

      if (errors) {
        errors.forEach((error) =>
          dispatch(setAlert({ message: error.msg, alertType: 'error' }))
        );
      }

      return rejectWithValue(err.response?.data || 'Registration failed');
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

      const res = await axios.post('/api/auth/login', body, config);

      dispatch(
        setAlert({ message: 'Login successful!', alertType: 'success' })
      );

      return res.data;
    } catch (err) {
      const errors = err.response?.data?.errors;

      if (errors) {
        errors.forEach((error) =>
          dispatch(setAlert({ message: error.msg, alertType: 'error' }))
        );
      } else {
        dispatch(
          setAlert({
            message: err.response?.data?.message || 'Login failed',
            alertType: 'error',
          })
        );
      }

      return rejectWithValue(err.response?.data || 'Login failed');
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

      const res = await axios.get('/api/auth/profile');
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

      const res = await axios.put('/api/auth/profile', body, config);

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
    },
    clearAuthError: (state) => {
      state.error = null;
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

export const { logout, clearAuthError } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;

export default authSlice.reducer;
