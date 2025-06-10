import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, Alert as MuiAlert, Slide } from '@mui/material';
import { removeAlert, clearAlerts } from '../../features/alert/alertSlice';

const Alert = () => {
  const dispatch = useDispatch();
  const alerts = useSelector((state) => state.alert);

  const handleClose = (id) => {
    dispatch(removeAlert(id));
  };

  // Auto-remove alerts after 5 seconds
  useEffect(() => {
    if (alerts.length > 0) {
      const timer = setTimeout(() => {
        dispatch(removeAlert(alerts[0].id));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alerts, dispatch]);

  // Clear all alerts when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearAlerts());
    };
  }, [dispatch]);

  return (
    <>
      {alerts.map((alert) => (
        <Snackbar
          key={alert.id}
          open={true}
          autoHideDuration={5000}
          onClose={() => handleClose(alert.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          TransitionComponent={Slide}
          TransitionProps={{ direction: 'down' }}
          sx={{
            '& .MuiPaper-root': {
              width: '100%',
              maxWidth: '400px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          <MuiAlert
            onClose={() => handleClose(alert.id)}
            severity={alert.alertType === 'error' ? 'error' : 'success'}
            elevation={6}
            variant="filled"
            sx={{
              width: '100%',
              '& .MuiAlert-message': {
                fontSize: '0.95rem',
              },
            }}
          >
            {alert.message}
          </MuiAlert>
        </Snackbar>
      ))}
    </>
  );
};

export default Alert;
