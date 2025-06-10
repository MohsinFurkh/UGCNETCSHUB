import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlert: (state, action) => {
      const { id, message, alertType } = action.payload;
      const existingAlert = state.find(alert => alert.id === id);
      
      if (existingAlert) {
        // Update existing alert
        existingAlert.message = message;
        existingAlert.alertType = alertType;
      } else {
        // Add new alert
        state.push({
          id: id || Date.now().toString(),
          message,
          alertType,
        });
      }
    },
    removeAlert: (state, action) => {
      const id = action.payload;
      return state.filter(alert => alert.id !== id);
    },
    clearAlerts: () => {
      return [];
    },
  },
});

export const { setAlert, removeAlert, clearAlerts } = alertSlice.actions;

export const selectAlerts = (state) => state.alert;

export default alertSlice.reducer;
