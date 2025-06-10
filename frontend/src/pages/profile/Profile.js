import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, loadUser, logout } from '../../features/auth/authSlice';
import { setAlert } from '../../features/alert/alertSlice';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Divider,
  Avatar,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  FormControlLabel,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Bookmark as BookmarkIcon,
  History as HistoryIcon,
  BarChart as BarChartIcon,
  Logout as LogoutIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { format } from 'date-fns';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  const { 
    user, 
    loading, 
    error, 
    isAuthenticated 
  } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      dispatch(loadUser());
    }
  }, [isAuthenticated, navigate, dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setEditMode(false);
  };

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
    
    if (activeTab === 0 && editMode) {
      // Update profile info
      dispatch(updateProfile({ name: formData.name }));
      setEditMode(false);
    } else if (activeTab === 1) {
      // Change password
      if (formData.newPassword !== formData.confirmPassword) {
        dispatch(setAlert({ message: 'New passwords do not match', alertType: 'error' }));
        return;
      }
      
      if (formData.newPassword.length < 6) {
        dispatch(setAlert({ 
          message: 'Password must be at least 6 characters long', 
          alertType: 'error' 
        }));
        return;
      }
      
      dispatch(updateProfile({ 
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword 
      }));
      
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const renderProfileInfo = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" fontWeight={700}>
          Profile Information
        </Typography>
        {!editMode ? (
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setEditMode(true)}
          >
            Edit
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!editMode}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            value={formData.email}
            disabled
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText="Contact support to change your email address"
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderChangePassword = () => (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={4}>
        Change Password
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              type={formData.showCurrentPassword ? 'text' : 'password'}
              label="Current Password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle current password visibility"
                      onClick={() => handleClickShowPassword('showCurrentPassword')}
                      edge="end"
                    >
                      {formData.showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              type={formData.showNewPassword ? 'text' : 'password'}
              label="New Password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle new password visibility"
                      onClick={() => handleClickShowPassword('showNewPassword')}
                      edge="end"
                    >
                      {formData.showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText="At least 6 characters"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              type={formData.showConfirmPassword ? 'text' : 'password'}
              label="Confirm New Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
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
                      {formData.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              sx={{ mt: 2 }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );

  const renderBookmarks = () => (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={4}>
        My Bookmarks
      </Typography>
      
      {user.bookmarks && user.bookmarks.length > 0 ? (
        <List>
          {user.bookmarks.map((bookmark, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {bookmark.title || 'Untitled Bookmark'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {bookmark.description || 'No description available'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Added on: {format(new Date(bookmark.createdAt), 'MMM d, yyyy')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  View
                </Button>
                <Button size="small" color="error">
                  Remove
                </Button>
              </CardActions>
            </Card>
          ))}
        </List>
      ) : (
        <Box textAlign="center" py={4}>
          <BookmarkIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No bookmarks yet
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Save questions and resources to access them later
          </Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/questions')}>
            Browse Questions
          </Button>
        </Box>
      )}
    </Box>
  );

  const renderActivity = () => (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={4}>
        Recent Activity
      </Typography>
      
      <Box textAlign="center" py={4}>
        <HistoryIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No recent activity
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your activity will appear here
        </Typography>
      </Box>
    </Box>
  );

  const renderPerformance = () => (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={4}>
        Performance Overview
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Questions Attempted
              </Typography>
              <Typography variant="h4" component="div">
                {user.stats?.totalAttempted || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Correct Answers
              </Typography>
              <Typography variant="h4" component="div" color="success.main">
                {user.stats?.correctAnswers || 0}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <Box width="100%" mr={1}>
                  <LinearProgress 
                    variant="determinate" 
                    value={user.stats ? (user.stats.correctAnswers / user.stats.totalAttempted) * 100 : 0} 
                    color="success"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {user.stats && user.stats.totalAttempted > 0 
                    ? Math.round((user.stats.correctAnswers / user.stats.totalAttempted) * 100) 
                    : 0}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Average Score
              </Typography>
              <Typography variant="h4" component="div">
                {user.stats?.averageScore || 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Based on last 10 attempts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Performance by Subject
        </Typography>
        
        {user.stats?.subjectPerformance?.length > 0 ? (
          <List>
            {user.stats.subjectPerformance.map((subject, index) => (
              <Box key={index} mb={2}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">{subject.name}</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {subject.correctCount} / {subject.totalCount} ({subject.percentage}%)
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={subject.percentage} 
                  color={subject.percentage >= 70 ? 'success' : subject.percentage >= 40 ? 'warning' : 'error'}
                  sx={{ height: 8, borderRadius: 2 }}
                />
              </Box>
            ))}
          </List>
        ) : (
          <Box textAlign="center" py={4}>
            <BarChartIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              Complete some practice tests to see your performance metrics
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }}
              onClick={() => navigate('/practice')}
            >
              Start Practicing
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={4}>
        {/* Left Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box 
              sx={{ 
                height: 120, 
                bgcolor: 'primary.main',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -50,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  bgcolor: 'background.paper',
                  border: '4px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  sx={{ 
                    width: '100%', 
                    height: '100%',
                    fontSize: '2.5rem',
                  }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              </Box>
            </Box>

            <Box sx={{ mt: 8, textAlign: 'center', px: 3, pb: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user.email}
              </Typography>
              <Chip
                label={user.role === 'admin' ? 'Admin' : 'User'}
                color={user.role === 'admin' ? 'secondary' : 'default'}
                size="small"
                sx={{ mt: 1 }}
              />
              
              <Box mt={3}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  fullWidth
                >
                  Logout
                </Button>
              </Box>
            </Box>

            <Divider />

            <List>
              <ListItem 
                button 
                selected={activeTab === 0}
                onClick={() => setActiveTab(0)}
              >
                <ListItemIcon>
                  <PersonIcon color={activeTab === 0 ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Profile Information" />
              </ListItem>
              <ListItem 
                button 
                selected={activeTab === 1}
                onClick={() => setActiveTab(1)}
              >
                <ListItemIcon>
                  <LockIcon color={activeTab === 1 ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Change Password" />
              </ListItem>
              <ListItem 
                button 
                selected={activeTab === 2}
                onClick={() => setActiveTab(2)}
              >
                <ListItemIcon>
                  <BookmarkIcon color={activeTab === 2 ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Bookmarks" />
                <Chip label={user.bookmarks?.length || 0} size="small" />
              </ListItem>
              <ListItem 
                button 
                selected={activeTab === 3}
                onClick={() => setActiveTab(3)}
              >
                <ListItemIcon>
                  <HistoryIcon color={activeTab === 3 ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Activity History" />
              </ListItem>
              <ListItem 
                button 
                selected={activeTab === 4}
                onClick={() => setActiveTab(4)}
              >
                <ListItemIcon>
                  <BarChartIcon color={activeTab === 4 ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Performance" />
              </ListItem>
            </List>
          </Paper>

          <Box mt={3} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Member since {user.createdAt ? format(new Date(user.createdAt), 'MMM yyyy') : 'N/A'}
            </Typography>
          </Box>
        </Grid>

        {/* Right Content */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ borderRadius: 2, p: 4, minHeight: '500px' }}>
            {activeTab === 0 && renderProfileInfo()}
            {activeTab === 1 && renderChangePassword()}
            {activeTab === 2 && renderBookmarks()}
            {activeTab === 3 && renderActivity()}
            {activeTab === 4 && renderPerformance()}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
